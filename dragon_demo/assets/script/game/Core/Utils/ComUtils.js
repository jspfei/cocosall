const k_B = 1000000000;
const k_M = 1000000;
const k_K = 1000;
/** @type {*} */
var ComUtils = cc.Class({
        name:"ComUtils",

        statics :{
                _loadLocal:null,

                 /**
                 * 获取随机点
                 * @param {出入初始位置} vec 
                 * @param {随机范围} randomParamX 
                 * @param {随机范围} randomParamY 
                 */
                randomPosVec2(vec, randomParamX, randomParamY) {
                      let randomValueX = Math.floor(Math.random() * Math.floor(randomParamX));
                      let randomValueY = Math.floor(Math.random() * Math.floor(randomParamY));
                      
                      let plusMinus = Math.floor(Math.random() * Math.floor(2));
                      if(plusMinus == 1) {
                           randomParamX = randomParamX * -1;
                           randomParamY = randomParamY * -1;
                      }
                      vec.x = Math.floor(vec.x + randomValueX);
                      vec.y = Math.floor(vec.y + randomValueY);
                      return vec;
                },

                /***  ***
                 * 数组排序
                 * @param {需要排序的数组} ay 
                 * @param {排序类型，1： 升序，2：降序} order 
                 */
                sortNumber (ay, order) {
                        let newAy = []
                        if(order == 1) {
                                newAy = ay.sort(function(a, b) {
                                        return a - b;
                                })
                        } else if(order == 2) {
                                newAy = ay.sort(function(a, b) {
                                        return b - a ;
                                })
                        }
                        return newAy
                },

                /*** *
                 * 十进制转换成二进制
                 */
                convert10to2(num) {
                        let temp = num;
                        temp = temp.toString(2);
                        let strAry = temp.split('');
                        if(strAry != null) {
                                let i = 0;
                                let len = strAry.length;
                                let ab = new ArrayBuffer(len)
                                let dv = new DataView(ab);
                                for (i = 0; i < len ;i++){
                                        dv.setInt8(i, parseInt(strAry[i]))
                                }
                                return ab;
                        } 
                },

                convert32to16(num) {
                        let chunk = ComUtils.convert10to2(num);
                        let b16 = new Int16Array(chunk.byteLength / 4);
                        let dv = new DataView(chunk);
                        for(let i = 0, offset = 0; offset < chunk.byteLength; i++, offset += 4){ 
                                const v = dv.getFloat32(offset, true);
                                b16[i] = v > 0 ? v * 32767 : v *32768;

                        }
                        return b16.buffer;
                },

                isFunction(fn){
                        return Object.prototype.toString.call(fn) === '[object Function]'
                },

                parseInt(val) {
                        if (val) {
                                let num  = parseInt(val);
                                if (!isNaN(num)){
                                        return num;
                                }
                        }
                        return 0;
                },

                arrayIndexOf(array, val, equalfunc) {
                        for(var i = 0; i < array.length; i++) {
                                if(equalfunc) {
                                        if(equalfunc(array[i], val)) return i;
                                } else {
                                        if(array[i] == val) return i;
                                }
                        }
                        return -1;
                },

                arrayRemove(array, obj, equalfunc) {
                        var index = -1;
                        if (equalfunc) {
                                index = this.arrayIndexOf(array, obj, equalfunc)
                                if (index > -1) {
                                        array.splice(index, 1)
                                }
                        } else {
                                if (array) {
                                        index = array.indexOf(obj);
                                        if (index > -1) {
                                                array.splice(index, 1)
                                        }
                                }
                        }
                        return index;
                },

                arrayShuffle(array) {
                        for(var j, x, i = array.length; i; j = parseInt(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x) ;
                        return array;
                },

                undefined(obj) {
                        return (typeof obj === 'undefined')
                },

                chipToStr(number, plus = false, fix = 0) {
                        if(isNaN(number)) {
                                return number;
                        }

                        let string = '';
                        let p = plus;
                        if (p && number > 0) {
                                string = '+'
                        }
                        let hasK = false;
                        let hasM = false;
                        let hasB = false;
                        if(Math.abs(number) >= k_B ) {
                                hasB = true;
                                if (fix > 0) {
                                        number = this.toFix(1.0 * number / k_B, fix);
                                } else {
                                        number = praseInt(number / k_B)
                                }
                        } else if(Math.abs(number) >= k_M){
                                hasM = true;
                                if (fix > 0) {
                                        number  = this.toFix(1.0 * number / k_M, fix)
                                } else {
                                        number = parseInt(number / k_M)
                                }
                        } else if(Math.abs(number) >= k_K * 10) {
                                hasK = true;
                                if (fix > 0) {
                                        number = this.toFix(1.0 * number / k_K, fix)
                                } else {
                                        number = parseInt(number / k_K)
                                }
                        } else {


                        }
                        string = string + number;
                        
                        if(hasK) {
                                string = string + 'K'
                        }

                        if(hasM) {
                                string = string + 'M'
                        }

                        if (hasB) {
                                string = string + 'B'
                        }
                        return string;

                },

                toFix(str, num = 2) {
                        str = '' + str;
                        let ret = ""
                        let p = str.indexOf(".");
                        if (p > -1) {
                                let end = Math.min(p + num + 1, str.length)
                                for(let i = 0; i < end; i++){
                                        ret += str[i]
                                }
                                let i = ret.length - 1;
                                return ret;
                        }
                        return str;
                },

                chipToStrStrict(number, plus = false, fix = 0){
                        let string = ''
                        let p = plus
                        if (p && number > 0) {
                                string = '+'
                        }

                        let hasK = false;
                        let hasM = false;
                        let hasB = false;
            
                        if (Math.abs(number) >= k_B) {
                            hasB = true;
                            if (fix > 0) {
                                number = this.toFix(1.0 * number / k_B, fix);
                            } else {
                                number = parseInt(number / k_B);
                            }
                        }else if (Math.abs(number) >= k_M) {
                            hasM = true;
                            if (fix > 0) {
                                number = this.toFix(1.0 * number / k_M, fix);
                            } else {
                                number = parseInt(number / k_M);
                            }
            
                        } else if (Math.abs(number) >= k_K) {
                            hasK = true;
                            if (fix > 0) {
                                number = this.toFix(1.0 * number / k_K, fix);
                            } else {
                                number = parseInt(number / k_K);
                            }
                        }
            
            
            
                        string = string + number;
            
                        if (hasK) {
                            string = string + 'K';
                        }
            
                        if (hasM) {
                            string = string + 'M';
                        }
            
                        if (hasB){
                            string = string + 'B'
                        }
                        return string;
                },

                chipToKStr(number, plus = false) {
                        let string = ''
                        let p = plus;
                        if (p && number) {
                                string = "+"
                        }

                        let hasK = false;
                        if (Math.abs(number) >= k_K * 10) {
                                hasK = true;
                                number = parseInt(number / k_K)
                        }

                        string = string + number;
                        if (hasK) {
                                string = string +'K'
                        }
                        return string;
                        
                },

                compareVersion:function(versionA, versionB) {
                        let vA = versionA.split('.')
                        let vB = versionB.split('.');
                        for (let i = 0; i < vA.length; ++i) {
                                let a = parseInt(vA[i])
                                let b = parseInt(vB[i] || 0)
                                if (a === b) {
                                        continue;
                                } else {
                                        return a - b;
                                }
                        }

                        if (vB.length > vA.length) {
                                return -1;
                        } else {
                                return 0;
                        }
                },

                FormatDate(date, fmt) {
                        var o = {
                              "M+": date.getMonth() + 1,
                              "d+": date.getDate(),
                              "h+": date.getHours(),
                              "m+": date.getMinutes(),
                              "s+": date.getSeconds(),
                              "q+": Math.floor((date.getMonth() + 3) / 3),
                              "S": date.getMilliseconds()
                        };

                        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));

                        for (var k in o){
                                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace((RegExp.$1, (RegExp.$1.length == 1)) ? (o[k]) : (("00" + o[k]).substr(("" + o[k])).length));
                        }

                        return fmt;
                },

                isToday:function(date) {
                        let todayStr = this.FormatDate(new Date(), 'yyyy-MM-dd');
                        let dateStr = this.FormatDate(date, 'yyyy-MM-dd');
                        if (dateStr == todayStr) {
                                return true;
                        } else {
                                return false;
                        }
                },

                fixZeroNum: function(num, n) {
                        let len = num.toString().length;
                        while(len < n) {
                                num = "0" + num;
                                len++;
                        }
                        return '' + num;
                },

                fixSymbol:function(str, symbol = ',', step = 3) {
                        str = '' + str;
                        if (str.indexOf(symbol) > -1) {
                                return str;
                        }

                        let len = str.length;
                        let end = 0;
                        if (str.indexOf('-') ==0 ) {
                                end = 1;
                        }
                        if (len > step) {
                                let count = 0;
                                let ret = ''
                                for (let i = len -1; i >= end; i--){
                                        if (step == count) {
                                                ret = symbol + ret;
                                                count = 0
                                        }
                                        count++;
                                        ret = str[i] + ret;
                                }
                                if (end == 1) {
                                        return '-' + ret;
                                }


                                return ret;
                        }
                        return str;
                },

                FromatTimeHHmmss:function(duration) {
                        if (!isNaN(duration)) {
                                let ss = this.fixZeroNum(duration % 60 , 2)
                                let mm = this.fixZeroNum(parseInt(duration / 60 ) % 60, 2)
                                let hh = this.fixZeroNum(parseInt(duration / 3600 ) % 24, 2)
                                return hh + ":" + mm + ":" + ss;
                        } else {
                                return "00:00:00"
                        }
                },

                FormatTimemmss:function(duration) {
                        if(!isNaN(duration) && duration > 0) {
                                let ss = this.fixZeroNum(duration % 60, 2)
                                let mm = this.fixZeroNum(paresInt(duration / 60) % 60, 2)
                                let hh = ""
                                if (duration > 3600) {
                                        hh = this.fixZeroNum(parseInt(duration / 3600) % 24, 2) +":"
                                }
                                return hh + mm + ":" + ss ;

                        } else {        
                                return "00:00"
                        }
                },

                loadHeadIcon(headUrl, handler) {

                },

                loadRemoteSpriteFrame(url, callback) {
                        cc.loader.load({url : url, type :'jpg'}, function(err, texture) {
                                if (!err) {
                                        callback(new cc.SpriteFrame(texture))
                                } else {
                                        callback(null)
                                }
                        })
                },

                guid(){
                        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                                var r = Math.random() * 16 | 0, v = c == 'x' ?r : (r & 0x3 |0x8);
                                return v.toString(16)
                        })
                },

                parseQuery(urlStr) {
                        if (!urlStr) {
                                return null;
                        }
                        var url = "?" + urlStr.split("?")[1];
                        var theRequest = new Object();
                        if (url.indexOf("?") != -1){
                                var str = url.substr(1)
                                var strs = str.split("&")
                                for (var i = 0; i < strs.length; i++) {
                                        theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
                                }
                        }
                        return theRequest;
                },

                popAnimation(node, toScale = 1, callback = null, target) {
                        node.stopAllActions();
                        var action1 = cc.scaleTo(0.2, 0.9 * toScale);
                        var action2 = cc.scaleTo(0.1, 1.1 * toScale);
                        var action3 = cc.scaleTo(0.1, 1 * toScale);
                        let actArray = [action1, action2, action3]
                        if (callback) {
                                actArray.push(cc.callFunc(callback, target));
                        }
                        node.scale = 0
                        node.runAction(cc.sequence(actArray));
                },

                





        }
})