var Handler = require("Handler");
var PackageIn = require("PackageIn");
var PackageOut = require("PackageOut");

var SocketEvents = require("SocketEvents");
var SocketManager = require("SocketManager");

var ByteSocket = cc.Class({
        name: "ByteSocket",
        properties: () => ({
                _debug: false,

                _webSocket: WebSocket,
                _ip: "",
                _port: 0,
                _wsUrl: "",
                _encrypted: false,
                KEY: [],
                RECEIVE_KEY: ArrayBuffer,
                SEND_KEY: DataView,
                _receiveKeyDataView: DataView,
                _sendKeyDataView: DataView,
                _readOffset: 0,
                _writeOffset: 0,
                _headerTemp: ArrayBuffer,
                _m_PackageQueue: [],
                _isCloseBln: false,
        }),

        statics: {
                HANDLER_MAX: 50,
                SOCKET_ENTER_FRAME: "socketEnterFrame"
        },

        init(encrypted, isDebug = false) {
                let self = this;
                this._dispose = false;
                self.KEY = new Array(0xae, 0xbf, 0x56, 0x78, 0xab, 0xcd, 0xef, 0xf1);
                self._debug = isDebug;
                self._readBuffer = new ArrayBuffer();
                self._headerTemp = new ArrayBuffer();
                self._encrypted = encrypted;
                self.setKey(self.KEY)
                self.removeFrameHandler();
                self._framHanler = Handler.create(self, self.enterFrameHanlder, null, false);
        },

        connect(ip) {
                let self = this
                if (self._webSocket != null) {
                        self.close()
                }

                self._isCloseBln = false;
                self._ip = ip;
                self._wsUrl = ip.toString();

                //TCP 连接
                self._webSocket = new WebSocket(self._wsUrl)
                self._webSocket.binaryType = "arraybuffer";

                self._webSocket.onmessage = self.onReceiveMessageHandler.bind(self);
                self._webSocket.onopen = self.onConnectHandler.bind(self)
                self._webSocket.onclose = self.onCloseHandler.bind(self)
                self._webSocket.onerror = self.onErrorHandler.bind(self)
        },
        onReceiveMessageHandler(evt) {
                let self = this;
                if (this._dispose) {
                        return;
                }
                let buffer = evt.data;
                let len = buffer.byteLength;
                if (len > 0) {
                        self._readBuffer = buffer.slice(0)
                        self.readEasyPackage();
                }
        },


        onConnectHandler(evt) {
                let self = this;
                if (this._dispose) {
                        return;
                }
                jf.logI("[提示] 链接socket成功 > ip > " + self._wsUrl);
                SocketManager = require("SocketManager")
                SocketManager.instance.connectHandler(null);
        },

        onCloseHandler(evt) {
                let self = this;
                if (this._dispose) {
                        return;
                }
                SocketManager = require("SocketManager")
                SocketManager.instance.dispatchEventWith(SocketEvents.SOCKET_CLOSE, evt.detail)
                self.removeFrameHandler()
        },

        onErrorHandler(evt) {
                if (this._dispose) {
                        return;
                }

                SocketManager = require("SocketManager")
                SocketManager.instance.dispatchEventWith(SocketEvents.SOCKET_ERROR, evt.detail);
        },

        setKey(keys) {
                let self = this;
                self.RECEIVE_KEY = new ArrayBuffer(8);
                self.SEND_KEY = new ArrayBuffer(8);

                self._receiveKeyDataView = new DataView(self.RECEIVE_KEY);
                self._sendKeyDataView = new DataView(self.SEND_KEY);

                for (let i = 0; i < 8; i++) {
                        self._receiveKeyDataView.setInt8(i, key[i]);
                        self._sendKeyDataView.setInt8(i, keys[i]);
                }

        },

        resetReceiveKey(key) {
                let self = this;
                self.RECEIVE_KEY = key.slice(0)
                self._receiveKeyDataView = new DataView(self.RECEIVE_KEY);
        },

        sendProtobuffer(pkgout, data) {
                let self = this;
                if (data != null) {
                        pkgout.pushMsg(data)
                }
                self.send(pkgout)
        },

        send(pkgOut) {
                let self = this;
                if (self._webSocket != null && self._webSocket.readyState == WebSocket.OPEN) {
                        pkgOut.pack()
                        if (self._encryted) {
                                let dataH;
                                let sendH;
                                let lastData;
                                let pagPosition = 0
                                let sendPosition = 0
                                let sendDataBy = new ArrayBuffer(pkgOut.packageLen);
                                let sendKeyDataBy = new ArrayBuffer(8);
                                let nextKeyDataBy = new ArrayBuffer(8)

                                let sendDataByDataView = new DataView(sendDataBy);
                                let sendKeyDataByDataView = new DataView(sendKeyDataBy)

                                let nextKeyDataByDataView = new DataView(nextKeyDataBy)

                                let nextKeyPosition = 0;
                                for (let i = 0; i < pkgOut.packageLen; i++) {
                                        if (i > 0) {
                                                pagPosition = i;
                                                sendPosition = i % 8;

                                                let tempPkgData = lastData;
                                                if (i >= 8) {

                                                        sendH = sendKeyDataByDataView.getInt8(sendPosition);
                                                        sendH = (sendH + tempPkgData) ^ i;
                                                        nextKeyDataByDataView.setInt8(sendPosition, sendH);
                                                        nextKeyPosition++;

                                                        if (sendPosition >= 7 && nextKeyPosition > 0) {
                                                                sendKeyDataBy = null;
                                                                sendKeyDataBy = nextKeyDataBy.slice(0)
                                                                sendDataByDataView = new DataView(sendKeyDataBy);
                                                                nextKeyDataBy = null;
                                                                nextKeyDataBy = new ArrayBuffer(8)
                                                                nextKeyDataByDataView = new DataView(nextKeyDataBy)
                                                                nextKeyPosition = 0;
                                                        }
                                                } else {

                                                        sendH = self._sendKeyDataView.getInt8(sendPosition)
                                                        sendH = (sendH + tempPkgData) ^ i;
                                                        sendKeyDataByDataView.setInt8(sendPosition, sendH)
                                                }

                                                dataH = pkgOut.bufferDataView.getInt8(pagPosition);
                                                dataH = (dataH ^ sendH) + tempPkgData;
                                                lastData = dataH;
                                                sendDataByDataView.setInt8(pagPosition, dataH);
                                        } else {
                                                dataH = pkgOut.bufferDataView.getInt8(pagPosition)
                                                sendH = self._sendKeyDataView.getInt8(sendPosition)
                                                dataH = dataH ^ sendH;
                                                lastData = dataH;
                                                sendDataByDataView.setInt8(pagPosition, dataH)
                                                sendKeyDataByDataView.setInt8(sendPosition, sendH)
                                        }
                                }

                                let keyBackup = new ArrayBuffer(8)
                                let keyBackupDataView = new DataView(keyBackup)
                                let i = 0;
                                for (i = 0; i < nextKeyPosition; i++) {
                                        keyBackupDataView.setInt8(i, nextKeyDataByDataView.getInt8(i))
                                }
                                for (i = nextKeyPosition; i < sendKeyDataBy.byteLength; i++) {
                                        keyBackupDataView.setInt8(i, sendKeyDataByDataView.getInt8(i));
                                }

                                self.SEND_KEY = null;
                                self._sendKeyDataView = null;
                                self.SEND_KEY = keyBackup.slice(0)
                                self._sendKeyDataView = new DataView(self.SEND_KEY);

                                keyBackup = null;
                                keyBackupDataView = null;
                                sendKeyDataBy = null;
                                sendDataByDataView = null;
                                nextKeyDataBy = null;
                                nextKeyDataByDataView = null;

                                if (CC_PREVIEW) {

                                }
                                self._webSocket.send(sendDataBy)
                        } else {
                                self._webSocket.send(pkgOut.buffer)
                        }
                }
        },

        readEasyPackage() {
                let self = this;
                let readByte = self._readBuffer.slice(0);
                let readBufferDataView = new DataView(self._readBuffer);

                self._headerTemp = null;
		self._headerTemp = new ArrayBuffer(8);
		let headerDataView = new DataView(self._headerTemp);
                let tempHeaderPosition = 0;
                headerDataView.setInt8(tempHeaderPosition, readBufferDataView.getInt8(tempHeaderPosition));
                tempHeaderPosition += 1;
                headerDataView.setInt8(tempHeaderPosition, readBufferDataView.getInt8(tempHeaderPosition));
                tempHeaderPosition += 1;
                headerDataView.setInt8(tempHeaderPosition, readBufferDataView.getInt8(tempHeaderPosition));
                tempHeaderPosition += 1;
                headerDataView.setInt8(tempHeaderPosition, readBufferDataView.getInt8(tempHeaderPosition));

                if(self._encryted) {
                        self._headerTemp = self.decrptBytes(self._headerTemp, 4, self.RECEIVE_KEY.slice(0))
                        headerDataView = null;
                        headerDataView = new DataView(self._headerTemp)
                }

                let len = 0;
                if(headerDataView.getInt16(0) == PackageOut.HEADER){
                        len = headerDataView.getUint16(2)
                }

                var buffer = new PackageIn()
                if(self ._encrypted) {
                        buffer.loadE(readByte, len ,self.RECEIVE_KEY)
                } else {
                        buffer.load(readByte, len);
                }
                self.handlePackage(buffer)
        },

        handlePackage(pkgIn) {
                let self = this;
                if (pkgIn.checksum == pkgIn.calculateCheckSum()){
                        self._m_PackageQueue.push(pkgIn)
                }
        },

        decrptBytes(buffer, len , key) {
                let self = this;
                let keyDataView = new DataView(key);
                let bufferDataView = new DataView(buffer);

                let result = new ArrayBuffer(len);
                let resultDataView = new DataView(result);

                let srcData;
                let lastSrcData;
                let keyData;

                let keyDataBy = new ArrayBuffer(8);
                let nextKeyDataBy = new ArrayBuffer(8)
                let keyDataByDataView = new DataView(keyDataBy);
                let nextKeyDataByDataView = new DataView(nextKeyDataBy);

                let keyPosition = 0;
                let srcPosition = 0;
                let tempResultData;
                let nextKeyPosition = 0;

                let i = 0;
                for (i = 0; i < len ;i++){
                        if (i > 0){
                                keyPosition = i % 8;
                                if (i >= 8) {
                                        keyData = keyDataByDataView.getInt8(keyPosition)
                                        keyData = (keyData + lastSrcData) ^ i;
                                        nextKeyDataByDataView.setInt8(nextKeyDataBy, keyData)
                                        nextKeyPosition += 1;

                                        if(keyPosition >= 7 && nextKeyPosition > 0){
                                                keyDataBy = null;
                                                keyDataBy = nextKeyDataBy.slice(0)
                                                keyDataByDataView = new DataView(keyDataBy);

                                                nextKeyDataBy = null;
                                                nextKeyDataBy = new ArrayBuffer(8)
                                                nextKeyDataByDataView = DataView(keyDataBy);
                                                nextKeyPosition = 0;
                                        }


                                } else { 
                                        keyData = keyDataView.getInt8(keyPosition);
                                        keyData = (keyData + lastSrcData ) ^ i;
                                        keyDataByDataView.setInt8(keyPosition, keyData)
                                } 

                                srcData = bufferDataView.getInt8(i);
                                tempResultData = ((srcData ^ lastSrcData) ^ keyData)
                                resultDataView.setInt8(i , tempResultData);
                                lastSrcData = srcData;

                        } else {
                                srcData = bufferDataView .getInt8(i);
                                keyData = keyDataView.getInt8(i);

                                tempResultData = (srcData ^ keyData);
                                resultDataView.setInt8(i, tempResultData)
                                keyDataByDataView.setInt8(i , keyData)
                                lastSrcData = srcData;
                        }
                }



                return result;
        },

        enterFrameHanlder(){
                let self = this;
                if(self._m_PackageQueue.length > 0) {
                        let handlerCount  = 0;
                        while(handlerCount < ByteSocket.HANDLER_MAX){
                                if(self._m_PackageQueue.length <= 0){
                                        return;
                                }

                                handlerCount++;
                                let pkg = self._m_PackageQueue.shift();
                                SocketManager = require("SocketManager")

                                if(CC_PREVIEW && pkg.code != 2){
                                        jf.log('dispatchEventWith->' + SocketEvents.GET_SC_EVENT(pkg.code))
                                }
                                SocketManager.instance.dispatchEventWith(SocketEvents.GET_SC_EVENT(pkg.code), pkg.readBody());   
                        }
                }

        },

        removeFrameHandler() {
                let self = this;
                if (self._frameHandler) {
                        self._framHanler.recover();
			self._framHanler = null;
                }
        }, 

        close() {
                let self = this;
                if (self._isCloseBln) {
                        return;
                }
                self.removeFrameHandler()
                self._isCloseBln = true;
                if (self._webSocket.readyState == WebSocket.OPEN) {
                        self._webSocket.close();
                }
                self._webSocket = null;
        },

        dispose() {
                this._dispose = true;
        }



})



