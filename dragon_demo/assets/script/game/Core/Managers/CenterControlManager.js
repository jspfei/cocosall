

var CenterControlManager = cc.Class({
        name : "CenterControlManager",
        statics : {
                instance :null,
        },

        properties:() =>({

        }),



        _encryptByDES(message) {
                let key = 'iKyJ/nRh6oUuyvIMdhThJITbSS8wQUb1PCsPcM6X0l4='
                let CryptoJS = require("CryptoJS")
                var keyHex = CryptoJS.enc.Utf8.parse(key);
                var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
                        mode:CryptoJS.mode.ECB,
                        padding:CryptoJS.pad.Pkcs7
                })
                return encrypted.toString();
        },

        _decryptByDES(ciphertext) {
                let key = 'iKyJ/nRh6oUuyvIMdhThJITbSS8wQUb1PCsPcM6X0l4='
                let CryptoJS = require("CryptoJS")
                var keyHex = CryptoJS.enc.Utf8.parse(key);
                var decrypted = CryptoJS.DES.decrypt({
                        ciphertext:CryptoJS.enc.Base64.parse(ciphertext)
                }, keyHex, {
                        mode:CryptoJS.mode.ECB,
                        padding:CryptoJS.pad.Pkcs7
                });
                return decrypted.toString(CryptoJS.enc.Utf8)
        }

})

CenterControlManager.instance = new CenterControlManager()
module.exports = CenterControlManager