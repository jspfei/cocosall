var io = require("IOUtils");
cc.Class({
    extends: cc.Component,
    properties: {
        manifestUrl: cc.RawAsset,
        updateUI: cc.Prefab,
        alertPrefab: cc.Prefab,
        downPrefab: cc.Prefab,
        root: cc.Node,
        _updating: false,
        _canRetry: false,
        _storagePath: ''
    },
 
    checkCb: function (event) {
        cc.info('checkCb   Code: ' + event.getEventCode());
        var self = this;
        var flag = false;

        cc.info('checkCb ---------------------  Code: ' + event.getEventCode());
        this.printProjectManifestExit("11")
        // this.panel.byteProgress.progress =0.6; 
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.panel.info.string = "No local manifest file found, hot update skipped.";
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                //this.panel.info.string = "Fail to download manifest file, hot update skipped.";
                // this.panel.info.string = "更新失败！"; 

                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                //  this.panel.info.string = "Already up to date with the latest remote version.";
                // this.panel.info.string = "已是最新资源"; 
                cc.poker.isUpdate = true;
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                // this.panel.info.string = 'New version found, please try to update.';
                this.panel.info.string = '检查到新资源，更新中......';
                //   this.panel.checkBtn.active = false;
                //  this.panel.fileProgress.progress = 0;
                this.panel.byteProgress.node.active = true;
                this.panel.byteLabel.node.active = true;
                this.panel.byteProgress.progress = 0;
                flag = true;

                break;
            default:

                return;
        }


        cc.eventManager.removeListener(this._checkListener);
        this._checkListener = null;
        this._updating = false;


        this.showCurrentResVesion();
        cc.info("check", "---flag ----" + flag)
        if (flag) {
            this.printProjectManifestExit("12")
            var callback1 = function (context, code) {
                context.panel.info.node.active = false;
                context.panel.byteProgress.progress = 0;
                context.hotUpdate();
            }
            this.setPanelDemo(callback1, this, event.getEventCode());
        }  

    }, 

    updateCb: function (event) {
        var needRestart = false;
        var failed = false;
        cc.info("info-->code", event.getEventCode());
        cc.info("updateCb ---------------code  ", event.getEventCode());
        // this.printProjectManifestExit("15")
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                cc.info("code 1-->", jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST)
                // this.panel.info.string = 'No local manifest file found, hot update skipped.';
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:

                cc.info("code 2-->", jsb.EventAssetsManager.UPDATE_PROGRESSION)
                this.panel.byteProgress.progress = event.getPercent();
                //   this.panel.fileProgress.progress = event.getPercentByFile();

                //  this.panel.fileLabel.string = event.getDownloadedFiles() + ' / ' + event.getTotalFiles(); 
                var mb = 1024 * 1024;
                var total = (event.getTotalBytes() / mb).toFixed(3) + "M";
                var current = (event.getDownloadedBytes() / mb).toFixed(3); +"M";
                this.panel.byteLabel.string = current + ' / ' + total;

                var msg = event.getMessage();
                if (msg) {
                    // this.panel.info.string = 'Updated file: ' + msg;
                    // cc.info(event.getPercent()/100 + '% : ' + msg);
                }

                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                cc.info("code 3-->", jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST)
                cc.info("code 4-->", jsb.EventAssetsManager.ERROR_PARSE_MANIFEST)
                // this.panel.info.string = 'Fail to download manifest file, hot update skipped.';
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                cc.info("code 5-->", jsb.EventAssetsManager.ALREADY_UP_TO_DATE)
                //  this.panel.info.string = 'Already up to date with the latest remote version.';
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                cc.info("code 6-->", jsb.EventAssetsManager.UPDATE_FINISHED)
                //  this.panel.info.string = 'Update finished. ' + event.getMessage();
                this.panel.info.string = '更新完成，重启中......';
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                cc.info("code 7-->", jsb.EventAssetsManager.UPDATE_FAILED)
                // this.panel.info.string = 'Update failed. ' + event.getMessage();
                cc.info("code 7-->", 'Update failed. ' + event.getMessage())
                // this.panel.retryBtn.active = true;
                cc.poker.isUpdate = false;
                this._updating = false;
                failed = true;
                this._canRetry = true;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                cc.info("code 8-->", jsb.EventAssetsManager.ERROR_UPDATING)
                // this.panel.info.string = 'Asset update error: ' + event.getAssetId() + ', ' + event.getMessage();
                failed = true;
                cc.info("code 8-->", 'Asset update error: ' + event.getAssetId() + ', ' + event.getMessage())
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                cc.info("code 9-->", jsb.EventAssetsManager.ERROR_DECOMPRESS)
                //  this.panel.info.string = event.getMessage();
                failed = true;
                break;
            default:
                break;
        }

        //  cc.info("update","---end ----update")
        var self = this;
        cc.info("update", "  failed  =  ", failed)
        if (failed) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
            this._updating = false;
            this.panel.info.string = "更新资源失败，请检查网络!";
            var callback = function () {
                self.onLoad();
            }
            cc.info("update", "---jump createAlert")
            this.createAlert("更新资源失败，请检查网络!", callback, this)
        }

        if (needRestart) {
            cc.info("needRestart", "---start ----needRestart")
            //清空登录用户信息 让用户重新微信授权
            io.put("userinfo", "");
            cc.poker = null;

            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
            // Prepend the manifest's search path
            var searchPaths = jsb.fileUtils.getSearchPaths();
            cc.info("------------------------searchPaths ", JSON.stringify(searchPaths));
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            cc.info("------------------------- new   search   path  ", JSON.stringify(newPaths));
            Array.prototype.unshift(searchPaths, newPaths);
            // This value will be retrieved and appended to the default search path during game startup,
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));

            cc.info("---------------------new   search   path 2 ", JSON.stringify(newPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);

            cc.audioEngine.stopAll();
            cc.game.restart();
        }
        //  cc.info("info-->updateCb",this.panel.info.string);
    },

    loadCustomManifest: function (customManifestStr) {
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            var manifest = new jsb.Manifest(customManifestStr, this._storagePath);
            this.manifestUrl = manifest;
            this._am.loadLocalManifest(manifest, this._storagePath);

        }
    },

    retry: function () {
        if (!this._updating && this._canRetry) {
            //  this.panel.retryBtn.active = false;
            this._canRetry = false;

            this.panel.info.string = 'Retry failed Assets...';
            this._am.downloadFailedAssets();
        }
    },

    printManifest: function (tag) {

        var manifest = this._am.getLocalManifest();
        cc.info('-------------------local Manifest----------------------')
        if (manifest != null) {
            cc.info(tag, " local manifest getPackageUrl ", manifest.getPackageUrl());
            cc.info(tag, " local manifest  getManifestFileUrl ", manifest.getManifestFileUrl());
            cc.info(tag, " local manifest getVersionFileUrl ", manifest.getVersionFileUrl());
            cc.info(tag, " local manifest getVersion ", manifest.getVersion());
        }
        cc.info('-------------------remote Manifest----------------------')
        manifest = this._am.getRemoteManifest();
        if (manifest != null) {
            cc.info(tag, " remote manifest getPackageUrl ", manifest.getPackageUrl());
            cc.info(tag, " remote manifest  getManifestFileUrl ", manifest.getManifestFileUrl());
            cc.info(tag, " remote manifest getVersionFileUrl ", manifest.getVersionFileUrl());
            cc.info(tag, " remote manifest getVersion ", manifest.getVersion());
        }
        cc.info('-------------------end print Manifest----------------------')
    },
    checkUpdate: function () {
        cc.info("check", "---start ----check")

        try {
            if (this._updating) {
                this.panel.info.string = 'Checking or updating ...';
                return;
            }
            cc.info("info-->checkUpdate this.manifestUrl ", this._am.getState());
            cc.info("info-->checkUpdate this.manifestUrl ", this.manifestUrl);

            this.printManifest('1')
            this.printProjectManifestExit("8")
            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                this._am.loadLocalManifest(this.manifestUrl);
            }
            cc.info("this._am.getLocalManifest() ... ", this._am.getLocalManifest());
            if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
                this.panel.info.string = 'Failed to load local manifest ...';

                cc.info("Checking  Failed to load local manifest ... ", this.manifestUrl);
                return;
            }

            this.printManifest('2')
            this.printProjectManifestExit("9")
            this._checkListener = new jsb.EventListenerAssetsManager(this._am, this.checkCb.bind(this));
            cc.eventManager.addListener(this._checkListener, 1);

            this._am.checkUpdate();
            this.printManifest('3')
            this._updating = true;
            this.printProjectManifestExit("10")
            cc.info("info-->checkUpdate", this.panel.info.string);
        } catch (error) {
            this.updateUIs.active = false;
            cc.info("%s -- %s", error.name, error.message);
        }

    },
    setPanelDemo: function (back, context, code) {
        var self = this;
        cc.info('checkCb 1  count: ' + self.count);

        this.schedule(function () {
            self.count = self.count + 1;
            cc.info('checkCb 1  count: ' + self.count);
            if (self.panel != null) {
                self.panel.byteProgress.progress = 0.2 * self.count;
                cc.info('checkCb  1 progress: ' + self.panel.byteProgress.progress);
            }
            if (self.count == 5) {
                back(context, code);
            }
        }, 0.2, 5);

    },
    hotUpdate: function () {

        if (this._am && !this._updating) {
            this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCb.bind(this));
            cc.eventManager.addListener(this._updateListener, 1);
            cc.info("info-->hotUpdate this._am.getState() ", this._am.getState());
            cc.info("info-->hotUpdate this.manifestUrl ", this.manifestUrl);

            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                this._am.loadLocalManifest(this.manifestUrl);
                cc.info("info-->hotUpdate this.manifestUrl 2 ", this.manifestUrl);
                this.printManifest('5')
            }


            this._failCount = 0;
            this._am.update();
            // this.panel.updateBtn.active = false;
            this._updating = true;
        }
    },

    show: function () {
        if (this.updateUIs.active === false) {
            this.updateUIs.active = true;
        }
    },
    // use this for initialization
    onLoad: function () {
        this.downUi = null;
      
        // Hot update is only available in Native build
        if (!cc.sys.isNative) {
            return;
        }
        if (cc.poker.isUpdate) { //已经更新过检测过，不在检测更新
            return;
        }
 
        var self = this;
        this.alertdialog = null;
        // this.forceDownApk();
        self.readUpdate();
    },
    checkBaseVersion: function () {

    },

    printProjectManifestExit(tag) {

        cc.info("------------start-------" + tag + "-----------------------")
        var fileIsExit2 = jsb.fileUtils.isFileExist(this._storagePath + '/project.manifest');
        cc.info("-------------------  project.manifest  exit =  " + fileIsExit2 + "-----------")
        if (fileIsExit2) {
            let filestring = jsb.fileUtils.getStringFromFile(this._storagePath + '/project.manifest');
            let obj = JSON.parse(filestring);

            cc.info("-------------------  project.manifest  packageUrl =  " + obj.packageUrl + "-----------")
            cc.info("-------------------  project.manifest  version =  " + obj.version + "-----------")
        }
    },

    readUpdate: function () {


        this.count = 0;
        this.isCheck = true;
        if (this.updateUIs != null) {
            this.updateUIs.destroy();
            this.updateUIs = null;
        }
        this.updateUIs = cc.instantiate(this.updateUI);
        this.updateUIs.parent = this.root;
        this.panel = this.updateUIs.getComponent("UpdatePanel");
        this.panel.byteProgress.node.active = true;
        this.panel.byteLabel.node.active = false;

        if (this.isTestMode) {
            this.panel.linetest.active = true;
        } else {
            this.panel.linetest.active = false;
        }

        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'blackjack-remote-asset');
        cc.info('Storage path for remote asset : ' + this._storagePath);
        // Setup your own version compare handler, versionA and B is versions in string
        // if the return value greater than 0, versionA is greater than B,
        // if the return value equals 0, versionA equals to B,
        // if the return value smaller than 0, versionA is smaller than B.
        var self = this;
        this.versionCompareHandle = function (versionA, versionB) {
            cc.info("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);

            var vA = versionA.split('.');
            var vB = versionB.split('.');
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || 0);
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
        };

        this.printProjectManifestExit("6")
        this._am = new jsb.AssetsManager('', this._storagePath, this.versionCompareHandle);
        this.printProjectManifestExit("6-1")
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            this._am.loadLocalManifest(this.manifestUrl);
        }
        cc.info("this._am.getState() 1  " + this._am.getState())
        this.printProjectManifestExit("7")

        this.showCurrentResVesion();

        if (!cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            this._am.retain();
        }

        var panel = this.panel;
        // Setup the verification callback, but we don't have md5 check function yet, so only print some message
        // Return true if the verification passed, otherwise return false
        this._am.setVerifyCallback(function (path, asset) {
            // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
            var compressed = asset.compressed;
            // Retrieve the correct md5 value.
            var expectedMD5 = asset.md5;
            // asset.path is relative path and path is absolute.
            var relativePath = asset.path;
            // The size of asset file, but this value could be absent.
            var size = asset.size;
            if (compressed) {
                panel.info.string = "Verification passed : " + relativePath;
                return true;
            } else {
                panel.info.string = "Verification passed : " + relativePath + ' (' + expectedMD5 + ')';
                return true;
            }
        });

        this.panel.info.string = '检查服务器资源.....';

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            // Some Android device may slow down the download process when concurrent tasks is too much.
            // The value may not be accurate, please do more test and find what's most suitable for your game.
            this._am.setMaxConcurrentTask(2);
            // this.panel.info.string = "Max concurrent tasks count have been limited to 2";
        }
        this.panel.byteProgress.progress = 0;

        this.checkUpdate();

    },

    /**
     * 是否有基础版本更新
     */
    hasBaseVerionUpdate: function () {
        var self = this;
        //判断是否有基础版本更新
        cc.poker.c8Mgr.getHasBaseVersionUpdate(function (data) {
            if (data) {
                cc.info("baseversion  data   ", data);
                //基础版本提示更新。
                if (data.data.update) {
                    var callback = function () {
                        if (cc.sys.os == cc.sys.OS_ANDROID) {
                            //更加协议判断，是弹出强制更新提示框，还是可选更新提示框
                            self.forceDownApk();
                        } else if (cc.sys.os == cc.sys.OS_IOS) {

                            jsb.reflection.callStaticMethod("AppController", "jumpAppStore:", data.data.link);
                        }
                        // 关闭 资源检查界面
                        self.updateUIs.active = false;
                    }
                    self.createAlert("检测到当前有最新版本，请前往下载更新并重新进入游戏。", callback, self)
                } else {
                    self.checkUpdate();
                }
            } else {
                self.checkUpdate();
            }

        });
    },
    onDestroy: function () {
        if (this._updateListener) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
        }
        if (this._am && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            this._am.release();
        }
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

    },
    //展示下载apk界面
    createShowDownScene: function (context) {
        cc.poker.androidCancelInstall = function(){
            cc.info("cancel  intallApk  ------")
        }
        context.downUi = cc.instantiate(context.downPrefab);
        context.downUi.parent = cc.find("Canvas");
        let temp = context.downUi.getComponent("DownPanel");
        //网络请求（url，超时限制，请求成功回调，请求失败回调，发送数据）
        var url = "https://dn-sao-ipa.qbox.me/479.hzjcbz.apk"
        var expath = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getExternalStoragePath", "()Ljava/lang/String;");
        cc.info("expath  ", expath);
        var dirpath = expath + "/download";
        var fileName = "jincanhzbz.apk";

        temp.downFile(url, dirpath, fileName, function (filePath) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "installAPK",
                    "(Ljava/lang/String;)V", filePath);
            }
        });
    },
    //可选是否更新
    optionalDownApk: function () {

    },
    //强制更新apk
    forceDownApk: function () {

       
        // 测试cocos 下载 apk 并且有Android 启动apk安装
        var self = this;
        self.createAlert("检测到当前有最新版本，请前往下载更新并重新进入游戏。", function () {

            if (cc.sys.os == cc.sys.OS_ANDROID) {
                self.createShowDownScene(self);
            }
        }, self);
    }
});