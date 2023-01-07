
var PackageIn = cc.Class({
        name: "PackageIn",   


        properties: () => ({
                _length: 0,
                _checksum:0,
                _clientId:0,
                _cmdID:0,
                _buffer:ArrayBuffer,
                _bufferDataView:DataView,

                checksum:{
                        get:function(){
                                return this._checksum
                        },
                        set:function(value) {
                                this._checksum = value;
                        }
                },

                clientId:{
                        get:function (){
                                return this._clientId
                        },
                        set:function(value) {
                                this._clientId = value;
                        }
                },

                code :{
                        get :function(){
                                return this._cmdID
                        },
                        set:function(value) {
                                this._cmdID = value;
                        }
                },

                buffer:{
                        get:function(){
                                return this._buffer;
                        }
                }
        }),

        statics: {
                HEADER_SIZE:8
        },

        loadE(src, len ,key) {
                let self = this;

                let srcDataView = new DataView(src)
                let keyDataView = new DataView(key)

                let i = 0;
                let origion = new ArrayBuffer(len)
                let result = new ArrayBuffer(len)

                let origionDataView = new DataView(origion)
                let resultDataView = new DataView(result)

                for (i = 0; i < len ;i++) {
                        origionDataView.setInt8(i ,  srcDataView.getInt8(i))
                }

                let srcData;
                let lastSrcData;

                let keyData;
                let keyDataBy = new ArrayBuffer(8);
                let nextKeyDataBy = new ArrayBuffer(8);

                let keyDataByDataView = new DataView(keyDataBy)
                let nextKeyDataByDataView = new DataView(nextKeyDataBy)

                let keyPosition = 0
                let srcPosition = 0;

                let tempResultData;
                let nextKeyPosition = 0;

                for(i = 0; i < len ;i++) {
                        if (i > 0) {
                                keyPosition = i % 8;
                                key.position = keyPosition;

                                if( i >= 8 ) {
                                        keyData = keyDataByDataView.getInt8(keyPosition)
                                        keyData = (keyData + lastSrcData) ^ i;
                                        nextKeyDataByDataView.setInt8(nextKeyPosition, keyData)
                                        nextKeyPosition += i;

                                        if(keyPosition >= 7 && nextKeyPosition > 0) {
                                                keyDataBy = null;
                                                keyDataBy = nextKeyDataBy.slice(0)
                                                keyDataByDataView = new DataView(keyDataBy);

                                                nextKeyDataBy = null;
                                                nextKeyDataBy = new ArrayBuffer(8)
                                                nextKeyDataByDataView = new DataView(nextKeyDataBy)
                                                nextKeyPosition = 0;
                                        } else {
                                                keyData = origionDataView.getInt8(i);
                                                keyData = (keyData + lastSrcData) ^ i;
                                                keyDataByDataView.setInt8(keyPosition, keyData)
                                        }

                                        srcData = origionDataView.getInt8(i)
                                        tempResultData = (srcData - lastSrcData) ^ keyData;
                                        resultDataView.setInt8(i , tempResultData)
                                        lastSrcData = srcData;
                                }
                        } else {
                                srcData = origionDataView.getInt8(i)
                                keyData = keyDataView.getInt8(i)
                                tempResultData = srcData ^ keyData;
                                resultDataView.setInt8(i , tempResultData)
                                keyDataByDataView.setInt8(i, keyData)
                                lastSrcData = srcData;
                        }
                }

                let keyBackup = new ArrayBuffer(8) 
                let keyBackupDataView = new DataView(keyBackup)
                for(i = 0; i < nextKeyPosition; i++) {
                        keyBackupDataView.setInt8(i, nextKeyDataByDataView.getInt8(i));
                }

                for(i = nextKeyPosition; i < keyDataView.byteLength; i++){
                        keyBackupDataView.setInt8(i , keyBackupDataView.getInt8(i));
                }
                SocketManager = require("SocketManager")
                SocketManager.instance._socket.resetReceiveKey(keyBackup.slice(0));
                keyBackup = null;
                keyDataBy = null;
                nextKeyDataBy = null;

                self._buffer = new ArrayBuffer(len)
                self._bufferDataView = new DataView(self._buffer)
                
                for(i = 0 ; i < len ;i++) {
                        self._bufferDataView.setInt8(i, resultDataView.getInt8(i))
                }

                try {
                        self.readHeader();
                } catch (error) {
                        console.log('------------------error packageIn data begin--------------------------')
                        console.log('error _bufferDataView len=> ' + self._bufferDataView.length);
                        ztj.trace()
                        console.log('------------------error packageIn data end--------------------------')
                        let SocketManager = require('SocketManager');
                        SocketManager.instance.close();    
                }
        },

        load(src, len) {
                let self = this;
                self._buffer = new ArrayBuffer(len)
                self._bufferDataView = new DataView(self._buffer)
                let srcDataView = new DataView(src)
                for (let i = 0; i < len ; i++){
                        self._bufferDataView.setInt8(i ,srcDataView.getInt8(i));
                }
                self.readHeader();
        },

        readHeader(){
                let self = this;
                self._length = self._bufferDataView.getInt16(2);
                self._checksum = self._bufferDataView.getInt16(4);
                self._cmdID = self._bufferDataView.getInt16(6)
        },

        readBody() {
                let self = this;
                let src = self._buffer.slice(0)
                let length = src.byteLength - PackageIn.HEADER_SIZE;
                let result = new ArrayBuffer(length)
                let resultDataView = new DataView(result)
                let offsetIndex = PackageIn.HEADER_SIZE
                for(let i = 0; i < length; i++) {
                        resultDataView.setInt8(i, self._bufferDataView.getInt8(offsetIndex))
                        offsetIndex++;
                }
                return result;

        },

        calculateCheckSum(){
                let self = this;
                let val1 = 0x77;
                let i = 6;
                let position = 6;
                while(i <  self._buffer.byteLength) {
                        i++;
                        let by = self._bufferDataView.getInt8(position)
                        position += i
                        let by1 = by & 0xff;
                        val1 += by1;
                }
                let sum = (val1) & 0x7F7F;
                return sum;
        }


});