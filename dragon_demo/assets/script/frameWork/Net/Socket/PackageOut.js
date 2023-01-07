
var PackageOut = cc.Class({
        name: "PackageOut",

        statics: {
                HEADER: 0x71ab,
                HEADER_SIZE:8,
        },

        properties: () => ({
                _checksum: 0,
                _cmdID:0,
                _sendBuff:ArrayBuffer,
                _sendDataView:DataView,
                _writer:ArrayBuffer,
                _packageLen:0,

                cmdID: {
                        get:function(){
                                return this._cmdID
                        }
                },

                buffer:{
                        get:function (){
                                return this._sendBuff
                        }
                },

                bufferDataView:{
                        get:function(){
                                return this._sendDataView
                        }
                },
                packageLen:{
                        get:function(){
                                return this._packageLen
                        }
                }
        }),

        init(cmdId, bufferLen) {
                let self = this;
                self._cmdID = cmdId;
                self._packageLen = bufferLen + 8;
                self._sendBuff = new ArrayBuffer(self._packageLen)
                self._sendDataView = new DataView(self._sendBuff);

                let sendDataPos = 0;
                self._sendDataView.setInt16(sendDataPos,PackageOut.HEADER);
                sendDataPos += 2;
                self._sendDataView.setInt16(sendDataPos,0)
                sendDataPos += 2;
                self._sendDataView.setInt16(sendDataPos,0)
                sendDataPos += 2;
                self._sendDataView.setInt16(sendDataPos,cmdId)
                self._checksum = 0;

        },

        pushMsg(bufferUint8) {
                let self  = this;
                let sendDataViewPos = PackageOut.HEADER_SIZE;
                let len = bufferUint8.byteLength;
                for(let i = 0; i < len ; i++) {
                        self._sendDataView.setUint8(sendDataViewPos, bufferUint8[i]);
                        sendDataViewPos += 1;
                }
        },

        pack(){
                let self = this;
                self._checksum = self.calculateCheckSum()
                let temp = new ArrayBuffer(4)
                let tempDataView = new DataView(temp)
                tempDataView.setInt16(0, self._sendBuff.byteLength)
                tempDataView.setInt16(2, self._checksum);

                let sendDataByteOffset = 2;
                let tempDataByteOffset = 0;
                self._sendDataView.setInt8(sendDataByteOffset,tempDataView.getInt8(tempDataByteOffset))

                sendDataByteOffset += 1;
                tempDataByteOffset += 1;
                self._sendDataView.setInt8(sendDataByteOffset, tempDataView.getInt8(tempDataByteOffset));

                sendDataByteOffset += 1;
                tempDataByteOffset += 1;
                self._sendDataView.setInt8(sendDataByteOffset, tempDataView.getInt8(tempDataByteOffset));

                sendDataByteOffset += 1;
                tempDataByteOffset += 1;
                self._sendDataView.setInt8(sendDataByteOffset, tempDataView.getInt8(tempDataByteOffset));


        },

        calculateCheckSum(){
                let self = this;
                let val1 = 0x77;
                let i = 6;
                let position = 6

                while(i < self._sendBuff.byteLength){
                        i++;
                        let by = self._sendDataView.getInt8(position)
                        position += 1
                        let by1 = by & 0xff;
                        val1 += by1;
                }

                return (val1) & 0x7F7F;
                
        }
      



})