;(function(global, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(global, true)
    } else {
        factory(global)
    }
})(typeof window !== 'undefined' ? window : this, function(window, noGlabal) {
    // bug fixed
    // 避免客户端在没有分享调用的页面执行这个函数
    window.codoon_share_status_callback = function() {
        // console.log("not used");
    }

    // bug fixed
    // 避免android刷新页面后，再点击右上角分享，会找不到这个函数的问题
    window.CodoonGetInfo = function() {
        // console.log("not used");
    }

    var type = function(o) {
        var s = Object.prototype.toString.call(o)
        return s.match (/\[object (.*?)\]/)[1].toLowerCase ()
    }

    function parseApiResponse(body, callback) {
        // 处理对象
        var data = body
        if (typeof data != 'object') {
            try {
                data = JSON.parse(data)
            } catch (e) {
                return callback(e)
            }
        }
        return callback(null, data)
    }

    var ShareStatusCallbackArrays = []

    var _codoonNative = function() {
        var self = this
        self.iOS = null
        self.android = null

        // 定义标示只运行一次的函数
        self.isSetDefaultShare = false
        self.isLoad = false

        // 提前运行的函数数组，在加载完成后会依次运行
        self.functionArray = []

        // 判断是否是android或者iOS
        var sUserAgent = navigator.userAgent.toLowerCase ()
        var bIsAndroid = (/android/).test (sUserAgent)
        var bIsIphoneOs = (/(ios)|(iphone os)/).test (sUserAgent)

        // jsObj是android客服端定义的注入对象
        if (bIsAndroid && window.jsObj) {
            self.android = window.jsObj
            self.isLoad = true
        } else if (bIsIphoneOs) {
            initiOSBridge()
        }

        function initiOSBridge() {
            if (window.WebViewJavascriptBridge) {
                _init(WebViewJavascriptBridge)
            } else {
                document.addEventListener(
                    'WebViewJavascriptBridgeReady',
                    function() {
                        _init(WebViewJavascriptBridge)
                    },
                    false
                )
            }

            function _init(WebViewJavascriptBridge) {
                self.isLoad = true
                self.iOS = WebViewJavascriptBridge
                // 这段代码事为了让编辑器识别callHandler和registerHandler定义了的
                if (!self.iOS.callHandler && !self.iOS.registerHandler) {
                    self.iOS.callHandler = function() {}
                    self.iOS.registerHandler = function () {}
                }

                // 这里的初始化不能少，运行这个函数后，页面才能收到iOS的回调
                if (!window._isCBJInited) {
                    self.iOS.init(function(message, responseCallback) {})
                    window._isCBJInited = true
                }

                // 运行提前调用的函数
                if (self.functionArray.length > 0) {
                    self.functionArray.forEach(function(item, index) {
                        setTimeout(item, index * 20)
                    })
                }
            }
        }

        //判断app版本号a是否大于=b
        self.isVersionAthanB = function(a, b) {
            var numberA = a.split ('.')
        var resultA =
          parseInt (numberA[0]) * 100 +
          parseInt (numberA[1]) * 10 +
          parseInt (numberA[2])
  
        var numberB = b.split ('.')
        var resultB =
          parseInt (numberB[0]) * 100 +
          parseInt (numberB[1]) * 10 +
          parseInt (numberB[2])
  
        if (resultA >= resultB) {
                return true
        } 
            return false
        
      };

        /**
         * 只调用不返回的函数模版，返回为
         * @param name
         * @returns {*}
         */
        self.singleFunction = function(funcName, options) {
            function _run () {
                if (self.android) {
                    if (self.android[funcName]) {
                        if (options) {
                            if (type (options) === 'object') {
                                self.android[funcName] (JSON.stringify (options))
                } else {
                                self.android[funcName] (options)
                }
                        } else {
                            self.android[funcName] ()
              }
                    } else {
                        return 'android not have ' + funcName
            }
                } else if (self.iOS) {
                    if (options) {
                        self.iOS.callHandler (funcName, options, function (response) {})
            } else {
                        self.iOS.callHandler (funcName, function (response) {})
            }
                } else {
                    return 'not in codoon app'
          }
            }
            if (self.isLoad) {
                return _run ()
        } 
            self.functionArray.push (_run)
        
        return null
      };

        /**
         * 函数返回的函数模版
         * @param funcName {string}     函数的名字
         * @param callback {function}   回调函数， 返回的第一个参数是错误信息，第二个是返回的服务端返回的对象
         */
        self.callbackFunction = function(funcName, callback) {
            function _run() {
                if (self.android) {
                    window[funcName] = function(response) {
                        response = parseJson(response)
                        var err = null
                        if (response.status) {
                            err = response.status
                        }
                        callback(err, response)
                    };
                }
                if (self.iOS) {
                    self.iOS.registerHandler(funcName, function(response) {
                        response = parseJson(response)
                        var err = null
                        if (response.status) {
                            err = response.status
                        }
                        callback(err, response)
                    })
                }
            }

            function parseJson(data) {
                if (typeof data !== 'object') {
                    try {
                        data = JSON.parse(data)
                    } catch (e) {
                        data = {
                            status: 'parse ' + funcName + ' error ' + e
                        }
                    }
                }

                return data
            }

            if (self.isLoad) {
                _run()
            } else {
                self.functionArray.push(_run)
            }
        }

        // 提前注册分享回调函数
        self.callbackFunction('codoon_share_status_callback', function(err, res) {
            // err为1， 表示这里返回的status为1
            // {data:{status:1, type:1}}
            // status: 1 成功 0 失败
            // type 取值
            // TARGET_SINA = 0;
            // WEIXIN_SESSION = 1;
            // TARGET_WEIXIN_CIRCLE = 2;
            // TARGET_QQ = 3;
            // TARGET_QZONE = 5;
            // TARGET_QQ_WEIBO = 4;
            var targetObject = {
                0: 'SINA',
                1: 'WEIXIN_SESSION',
                2: 'WEIXIN_CIRCLE',
                3: 'QQ',
                4: 'QQ_WEIBO',
                5: 'QZONE',
                6: 'CODOON_SPORT_CIRCLE',
                7: 'CODOON_SPORT_CLUB'
            }
            // alert(JSON.stringify(res));

            var shareResponse
            shareResponse = res
            // iOS 的结构是{status:1, type: 1}， android 7.2的结构是{data:[{status:1, type:1}]}。 7.3以后和iOS一样了
            if (self.android) {
                // android的数据结构很奇怪，可能是{data:[{status:1, type:1}]}，
                // 可能是{status:1, type: 1}
                if (res.data && res.data[0]) {
                    shareResponse = res.data[0]
                }
            }

            if (shareResponse.status === 1) {
                // status为1表示成功
                ShareStatusCallbackArrays.forEach(function(item) {
                    if (item) {
                        try {
                            item(null, targetObject[shareResponse.type])
                        } catch (e) {
                            // TODO 出错的情况先不管
                        }
                    }
                })
            } else {
                // status不为1表示分享失败啦
                ShareStatusCallbackArrays.forEach(function(item) {
                    if (item) {
                        try {
                            item('share error')
                        } catch (e) {
                            // TODO 出错的情况先不管
                        }
                    }
                })
            }
            // 清空掉回调，回调函数只执行一次，需要再次调用才会监听
            ShareStatusCallbackArrays = []
        })
    }

    /**
     * 得到DescContent
     * @param oCodoonShareDestination
     * @returns {{codoonTimeline: boolean, codoonGroup: boolean, weixinToFriend: boolean, weixinToTimeline: boolean, sinaWeibo: boolean, tencentQQ: boolean, tencentQzone: boolean}}
     */
    function getShareDescContent(oCodoonShareDestination) {
        var temp = {
            codoonTimeline: true,
            codoonGroup: true,
            weixinToFriend: false,
            weixinToTimeline: false,
            sinaWeibo: false,
            tencentQQ: false,
            tencentQzone: false
        }
        if (!oCodoonShareDestination) {
            temp.weixinToFriend = true
            temp.weixinToTimeline = true
            return temp
        }
        for (var key in temp) {
            temp[key] = !!oCodoonShareDestination[key]
        }
        return temp
    }

    /**
     * iOS旧版分享
     * @param self
     * @param options
     */
    function iOSOldShare(self, options, isTop) {
        self.iOS.callHandler(
            'codoon_share',
            [
                isTop ? 1 : 0,
                options.sCodoonShareTitle || '',
                options.sCodoonShareLineLink || '',
                options.sCodoonShareImgUrl || '',
                options.sCodoonShareDescContent || ''
            ],
            function(response) {}
        )
        // 分享回调函数，暂时没有用到
        // self.iOS.registerHandler('codoon_share_status_callback', function (response) {});
    }

    /**
     * iOS新版分享
     * @param self
     * @param options
     * @param isTop
     */
    function iOSNewShare(self, options, isTop) {
        self.iOS.callHandler(
            'codoon_share_handle',
            {
                nCodoonShareTitleButton: isTop,
                nCodoonShareImmediately: !isTop,
                sCodoonShareTitle: options.sCodoonShareTitle || '',
                sCodoonShareLineLink: options.sCodoonShareLineLink || '',
                sCodoonShareImgUrl: options.sCodoonShareImgUrl || '',
                sCodoonShareDescContent: options.sCodoonShareDescContent || '',
                oCodoonShareDestination: getShareDescContent(options.oCodoonShareDestination),
                sCodoonShareCodoonLineLink: options.sCodoonShareCodoonLineLink,
                sCodoonShareSource: options.sCodoonShareSource || '',
                sCodoonShareContentType: options.sCodoonShareContentType || 0,
                sCodoonAnalyticsShareSource: options.sCodoonAnalyticsShareSource || '',
                sCodoonShareExternInfo: options.sCodoonShareExternInfo || {}
            },
            function(response) {}
        )
        // self.iOS.registerHandler('codoon_share_status_callback', function (response) {});
    }

    /**
     * 自定义分享函数
     * @name nativeCustomerShare
     * @function
     * @param {object} options
     */

    _codoonNative.prototype.nativeCustomerShare = function(options) {
        /**
               * @name options
               * @key sCodoonShareTitle 设置分享的title
               * @key nCodoonShareImmediately 是否立即分享(IOS)
               * @key sCodoonShareLineLink 设置分享的链接
               * @key sCodoonShareImgUrl 设置分享出去的封面图片的src
               * @key sCodoonShareDescContent 设置分享的内容文本
               * @key oCodoonShareDestination 设置分享出去的途径
               * @key sCodoonShareCodoonLineLink 设置分享到咕咚运动全和咕咚群组的地址
               * @key sCodoonShareSource 设置分享出去的来源 || 'xmall : 电商' 后续有的补充
               * @key sCodoonShareContentType 设置分享出去的格式 || 0 : 默认格式  1: 图片格式，只分析 sCodoonShareImgUrl 这张图
               * @key sCodoonAnalyticsShareSource 设置分享页面的来源，用于神策统计
               * ---- oCodoonShareDestination(JSON) 格式 开始----
               * true: 选中
               * false: 不选中
               *  {
                codoonTimeline: true			 // 咕咚运动圈
                codoonGroup: true		       // 咕咚群组
                weixinToFriend: true,		   // 微信朋友
                weixinToTimeline: true,		 // 微信朋友圈
                sinaWeibo: true,				   // 新浪微博
                tencentQQ: true,				   // 腾讯QQ
                tencentQzone: true			   // 腾讯空间
            *  }
               * 默认只开启微信朋友、微信朋友圈
               * ---- sCodoonShareDestination(JSON) 格式 结束----
               * IOS新增一个字段，以及更换一个字段
               * @key nCodoonShareTitleButton:  // 是否显示顶部
               * @key nCodoonShareImmediately:  // 分享栏滑动上来
               */
        var self = this


        function _run () {
            if (self.android) {
                if (self.android.getInfo) {
                    // if ((self.requestAPPVersion() && self.requestAPPVersion().length === 5 && self.requestAPPVersion() < '6.3.0') || !self.requestAPPVersion()) {
                    // 	self.android.getInfo(
                    // 		options.sCodoonShareTitle || '',
                    // 		options.sCodoonShareLineLink || '',
                    // 		options.sCodoonShareImgUrl || '',
                    // 		options.sCodoonShareDescContent || ''
                    // 	);
                    // } else if( self.requestAPPVersion() < '8.6.0'){
                    // 	self.android.getInfo(
                    // 		options.sCodoonShareTitle || '',
                    // 		options.sCodoonShareLineLink || '',
                    // 		options.sCodoonShareImgUrl || '',
                    // 		options.sCodoonShareDescContent || '',
                    // 		JSON.stringify(getShareDescContent(options.oCodoonShareDestination)),
                    // 		options.sCodoonShareCodoonLineLink ? 'codoon://www.codoon.com/codoon/web_view?url=' + encodeURIComponent(options.sCodoonShareCodoonLineLink) : '',
                    // 		options.sCodoonShareSource || ''
                    // 	);
                    // }else{
                    // 	self.android.getInfo(
                    // 		options.sCodoonShareTitle || '',
                    // 		options.sCodoonShareLineLink || '',
                    // 		options.sCodoonShareImgUrl || '',
                    // 		options.sCodoonShareDescContent || '',
                    // 		JSON.stringify(getShareDescContent(options.oCodoonShareDestination)),
                    // 		options.sCodoonShareCodoonLineLink ? 'codoon://www.codoon.com/codoon/web_view?url=' + encodeURIComponent(options.sCodoonShareCodoonLineLink) : '',
                    // 		options.sCodoonShareSource || '',
                    // 		options.sCodoonShareContentType || 0
                    // 	);
                    // }

                    if (
                        (self.requestAPPVersion() &&
                            self.requestAPPVersion().length === 5 &&
                            self.requestAPPVersion() < '6.3.0') ||
                        !self.requestAPPVersion()
                    ) {
                        self.android.getInfo(
                            options.sCodoonShareTitle || '',
                            options.sCodoonShareLineLink || '',
                            options.sCodoonShareImgUrl || '',
                            options.sCodoonShareDescContent || ''
                        )
                        return;
                    }
                    if (self.isVersionAthanB(self.requestAPPVersion(), '8.38.0')) {
                        self.android.getInfo(
                            options.sCodoonShareTitle || '',
                            options.sCodoonShareLineLink || '',
                            options.sCodoonShareImgUrl || '',
                            options.sCodoonShareDescContent || '',
                            JSON.stringify(getShareDescContent(options.oCodoonShareDestination)),
                            options.sCodoonShareCodoonLineLink
                                ? 'codoon://www.codoon.com/codoon/web_view?url=' +
                                      encodeURIComponent(options.sCodoonShareCodoonLineLink)
                                : '',
                            options.sCodoonShareSource || '',
                            options.sCodoonShareContentType || 0,
                            options.sCodoonAnalyticsShareSource || '',
                            JSON.stringify(options.sCodoonShareExternInfo || {})
                        )
                    }
                    else if (self.isVersionAthanB (self.requestAPPVersion (), '8.12.0')) {
                        self.android.getInfo(
                            options.sCodoonShareTitle || '',
                            options.sCodoonShareLineLink || '',
                            options.sCodoonShareImgUrl || '',
                            options.sCodoonShareDescContent || '',
                            JSON.stringify(getShareDescContent(options.oCodoonShareDestination)),
                            options.sCodoonShareCodoonLineLink
                                ? 'codoon://www.codoon.com/codoon/web_view?url=' +
                                      encodeURIComponent(options.sCodoonShareCodoonLineLink)
                                : '',
                            options.sCodoonShareSource || '',
                            options.sCodoonShareContentType || 0,
                            options.sCodoonAnalyticsShareSource || ''
                        )
                    } else if (self.isVersionAthanB(self.requestAPPVersion(), '8.6.0')) {
                        self.android.getInfo(
                            options.sCodoonShareTitle || '',
                            options.sCodoonShareLineLink || '',
                            options.sCodoonShareImgUrl || '',
                            options.sCodoonShareDescContent || '',
                            JSON.stringify(getShareDescContent(options.oCodoonShareDestination)),
                            options.sCodoonShareCodoonLineLink
                                ? 'codoon://www.codoon.com/codoon/web_view?url=' +
                                      encodeURIComponent(options.sCodoonShareCodoonLineLink)
                                : '',
                            options.sCodoonShareSource || '',
                            options.sCodoonShareContentType || 0
                        )
                    } else {
                        self.android.getInfo(
                            options.sCodoonShareTitle || '',
                            options.sCodoonShareLineLink || '',
                            options.sCodoonShareImgUrl || '',
                            options.sCodoonShareDescContent || '',
                            JSON.stringify(getShareDescContent(options.oCodoonShareDestination)),
                            options.sCodoonShareCodoonLineLink
                                ? 'codoon://www.codoon.com/codoon/web_view?url=' +
                                      encodeURIComponent(options.sCodoonShareCodoonLineLink)
                                : '',
                            options.sCodoonShareSource || ''
                        )
                    }
                }
            }
            if (self.iOS) {
                if (
                    self.requestAPPVersion() &&
                    self.requestAPPVersion().length === 5 &&
                    self.requestAPPVersion() < '6.3.0'
                ) {
                    iOSOldShare(self, options, false)
                } else {
                    // 对URL进行encode并且拼接协议
                    if (options.sCodoonShareCodoonLineLink) {
                        options.sCodoonShareCodoonLineLink =
                            'codoon://www.codoon.com/codoon/web_view?url=' +
                            encodeURIComponent(options.sCodoonShareCodoonLineLink)
                    }
                    iOSNewShare(self, options, false)
                }
            }
        }
        if (self.isLoad) {
            _run()
        } else {
            self.functionArray.push(_run)
        }
        return null
    }

    /**
     * 开启右上角的分享，历史遗留问题，这个函数做了特殊处理
     * @name nativeTopBut 提供一个开启右上角分享的功能,并配置分享的内容，一旦开启便不能在当前webview关闭此按钮
     * @function
     * @param {object} options
     */
    _codoonNative.prototype.nativeTopButtonShare = function(options) {
        /**
         * @name options
         * @key sCodoonShareTitle 设置分享的title
         * @key sCodoonShareLineLink 设置分享的链接
         * @key sCodoonShareImgUrl 设置分享出去的封面图片的src
         * @key sCodoonShareDescContent 设置分享的内容文本
         */
        var self = this


        function _run () {
            if (self.android) {
                if (self.android.set_codoon_share) {
                    self.android.set_codoon_share(1, options.sCodoonShareImgUrl)
                }
                window.CodoonGetInfo = function() {
                    self.nativeCustomerShare(options)
                };
            }
            if (self.iOS) {
                if (
                    self.requestAPPVersion() &&
                    self.requestAPPVersion().length === 5 &&
                    self.requestAPPVersion() < '6.3.0'
                ) {
                    iOSOldShare(self, options, true)
                } else {
                    // 对URL进行encode并且拼接协议
                    if (options.sCodoonShareCodoonLineLink) {
                        options.sCodoonShareCodoonLineLink =
                            'codoon://www.codoon.com/codoon/web_view?url=' +
                            encodeURIComponent(options.sCodoonShareCodoonLineLink)
                    }
                    iOSNewShare(self, options, true)
                }
            }
        }
        if (self.isLoad) {
            _run()
        } else {
            self.functionArray.push(_run)
        }
        return null
    }

    /**
     * 分享回调函数，调用一次执行一次
     * @param callback
     */
    _codoonNative.prototype.nativeShareStatusCallback = function(callback) {
        // 把回调放入队列
        ShareStatusCallbackArrays.push(callback)
    }

    // 弹出原生上传图片组件,当用户上传文件后回调函数执行并返回
    _codoonNative.prototype.nativeUploadImg = function(callback) {
        this.callbackFunction('nativeUploadImgCallback', callback)
        return this.singleFunction ('nativeUploadImg')
    }

    /**
     * 下载多张图片
     * @param images {object}  里面有一个urls字段，包含图片地址的数组 urls:［"http://www.baidu.com/maiyao.jpg", "....xxx/xx.jpg"］
     * @param callback
     * @returns {*}
     */
    _codoonNative.prototype.nativeDownloadImg = function(images, callback) {
        this.callbackFunction('native_download_image_callback', callback)
        return this.singleFunction ('native_download_image', images)
    }

    /**
     * 弹出原生相册来显示图片
     * @param imgs {array}  包含图片地址的数组 ["http://www....com/xx.png", "http://www....com/xx.jpg"]
     */
    _codoonNative.prototype.nativeShowImgs = function(imgs) {
        return this.singleFunction('nativeShowImgs', imgs)
    }

    /**
     * 设置上面的导航栏的标题和背景颜色
     * @param options
     * @returns {*}
     */
    _codoonNative.prototype.nativeSetTitleBar = function(options) {
        return this.singleFunction('set_title_bar_background', options)
    }

    /**
     * 8.18增加
     * 用户在领取大礼包的时候，触发该事件，由客户端决定该如何进行下一步
     * 目前只有在用户大礼包页面使用
     */
    _codoonNative.prototype.getCodoonNewUserGift = function() {
        return this.singleFunction('codoon_get_new_user_gift')
    }

    /**
     * 获取客服端识别到到GPS
     * @param options
     */
    _codoonNative.prototype.nativeGetGps = function(callback) {
        this.callbackFunction('returnAmapGpsFormNative', callback)
        return this.singleFunction ('getAmapGpsFormNative')
    }

    /**
     * 获取城市信息 - 先获取客户端识别到GPS地理位置 - GPS定位失败 - 再查询ip定位
     * callback : {err,{
          city: '成都市',
          citycode: '510107',
          longitude: '104.0976',
          latitude: '30.35688',
          address: '四川省成武侯区桂溪路天府软件园d7'
        }
      }
     * @param options
     */
    _codoonNative.prototype.nativeGetGpsCity = function(callback) {
        var url = '//restapi.amap.com/v3/geocode/regeo',
            vm = this


        this.callbackFunction ('returnAmapGpsFormNative', function (err, res) {
            if (res && res.longitude && res.latitude) {
                var location = res.longitude + ',' + res.latitude


                vm.ajaxGetNew (
                    url,
                    {
                        key: '2b6fd202c3ba801775b22067da6e9396',
                        location,
                    },
                    function(err, response) {
                        if (err) {
                            return callback(err)
                        }

                        parseApiResponse(response, function(err, resData) {
                            if (err) {
                                return callback(err)
                            }

                            callback(null, {
                                city: resData.regeocode.addressComponent.city || '',
                                citycode: resData.regeocode.addressComponent.adcode || '',
                                longitude: res.longitude || '',
                                latitude: res.latitude || '',
                                address: resData.regeocode.formatted_address || ''
                            })
                        })
                    }
                )
            } else {
                vm.ajaxGetNew('http://www.codoon.com/activity/v1/api/getaddressbyip', {}, function(err, response) {
                    if (err) {
                        return callback(err)
                        }
                        parseApiResponse (response, function (err, resData) {
                        if (err) {
                            return callback(err)
                            }

                            callback (null, {
                            city: resData.data.pcd.city || '',
                            citycode: resData.data.pcd.cityCode || '',
                            longitude: resData.data.lng || '',
                            latitude: resData.data.lat || '',
                            address: ''
                        })
                    })
                })
            }
        })
        return this.singleFunction ('getAmapGpsFormNative')
    }

    /**
     * 设置页面标题
     * @param options
     * @returns {*}
     */
    _codoonNative.prototype.nativeSetPageTitle = function(options) {
        return this.singleFunction('get_page_title', options)
    }

    /**
     * 获取用户的token 回调函数里的err是一个对象,具体是不是错了自己判断,因为客户端每个接口的数据格式不同(囧)
     * @param callback {function} 返回的参数 function(err, { access_token: "xsdfasfd..." })
     * @returns {*}
     */
    _codoonNative.prototype.nativeGetUserToken = function(callback) {
        this.callbackFunction('CJB_get_extra_info_callback', callback)
        return this.singleFunction ('CJB_get_extra_info')
    }

    /**
     * 刷新用户的token 回调函数里的err是一个对象,具体是不是错了自己判断,因为客户端每个接口的数据格式不同(囧)
     * @param callback {function} 返回的参数 function(err, { access_token: "xsdfasfd..." })
     * @returns {*}
     */
    _codoonNative.prototype.nativeRefreshUserToken = function(callback) {
        this.callbackFunction('CJB_get_token_refresh_callback', callback)
        return this.singleFunction ('CJB_get_token_refresh')
    }

    /**
     * 响应客户端从native回到h5的动作
     * @param callback
     * @returns {*}
     */
    _codoonNative.prototype.nativeSwitchNotice = function(callback) {
        this.callbackFunction('native_switch_notice_callback', callback)
        return this.singleFunction ('open_native_switch_notice', 1)
    }

    /**
     * 用户绑定
     * @param options
     * @param callback
     * @returns {*}
     */
    _codoonNative.prototype.nativeUserBind = function(options, callback) {
        this.callbackFunction('native_user_bind_callback', callback)
        return this.singleFunction ('native_user_bind', options)
    }

    var jumpNativeLimit = false
    /**
     * 跳转到Native协议封装
     * @param options
     */
    _codoonNative.prototype.jumpNative = function(options, callback) {
        // 处理下短时间多次调用的问题
        if (jumpNativeLimit) {
            return
        }
        jumpNativeLimit = true
        setTimeout (function () {
            jumpNativeLimit = false
        }, 1000)
        // 进行一些特殊处理
        if (!this.isInCodoon ()) {
            if (options.type === 'webView') {
                if (callback) {
                    function change() {
                        if (!document.hidden) {
                            callback()
                            document.removeEventListener ('visibilitychange', change)
                        }
                    }
                    document.addEventListener('visibilitychange', change)
                }
                return window.open(options.value)
            }
        }

        var jumpObject = {
            webView: 'codoon://www.codoon.com/codoon/web_view?url='
        }

        switch (options.type) {
            case 'webView':
                if (options.value.substr(0, 6) === 'codoon') {
                    var iframe = document.createElement('iframe')
                    iframe.style.display = 'none'
                    iframe.src = options.value
                    document.body.appendChild (iframe)
                } else {
                    var iframe = document.createElement('iframe')
                    iframe.style.display = 'none'
                    iframe.src =
              jumpObject[options.type] +
              window.encodeURIComponent (options.value)
                    document.body.appendChild (iframe)
                }
                break
            default:
                break
        }
        if (callback) {
            this.nativeSwitchNotice(callback)
        }
    }

    /**
     * 这个函数可以跳转到地址管理页面，并且设置好了回来到时候，调用传递过来到callback函数
     * @param callback
     */
    _codoonNative.prototype.jumpToAddressManage = function(eventId, callback) {
        var url = 'http://www.codoon.com/activity/v1/addressmanage/index.html?eventId=' + eventId
        if (window.location.protocol === 'https:') {
            url = 'https://www.codoon.com/activity/v1/addressmanage/index.html?eventId=' + eventId
        }
        this.jumpNative(
            {
                type: 'webView',
                value: url
            },
            callback
        )
    }

    /**
     * 这个函数可以跳转到新的地址管理页面，并且设置好了回来到时候，调用传递过来到callback函数
     * @param callback
     */
    _codoonNative.prototype.jumpToAddressManageNew = function(eventId, callback) {
        var url = 'http://www.codoon.com/activity/v1/addressmanage2.0/index.html?eventId=' + eventId
        if (window.location.protocol === 'https:') {
            url = 'https://www.codoon.com/activity/v1/addressmanage2.0/index.html?eventId=' + eventId
        }
        this.jumpNative(
            {
                type: 'webView',
                value: url
            },
            callback
        )
    }

    /**
     * 获得当前活动的收货地址
     * @param eventId
     * @param callback
     */
    _codoonNative.prototype.getCurrentEventAddress = function(eventId, callback) {
        var self = this
        self.getEventAddressDetail (eventId, function (err, response) {
            if (err) {
                return callback(err)
            }
            if (!response) {
                // 这里判断当前用户没有用户地址，直接跳转到新增地址页面去
                self.updateCurrentEventAddress(eventId, callback)
            } else {
                // 这里有地址，直接返回地址信息
                callback(err, response)
            }
            console.log(response)
        })
    }

    _codoonNative.prototype.getEventAddressDetail = function(eventId, callback) {
        var url = '//www.codoon.com/activity/v1/api/address/detail'
        this.ajaxGet (
            url,
            {
                eventId,
            },
            function(err, response) {
                if (err) {
                    return callback(err)
                }
                callback(err, response.data)
            }
        )
    }

    /**
     * 更新当前地址的函数，先跳转到地址管理页面，然后返回后刷新当前地址数据
     * @param eventId
     * @param callback
     */
    _codoonNative.prototype.updateCurrentEventAddress = function(eventId, callback) {
        // 这里判断当前用户没有用户地址，直接跳转到新增地址页面去
        var self = this
        alert ('前往地址管理页面...')
        self.jumpToAddressManage (eventId, function () {
            self.getEventAddressDetail(eventId, callback)
        })
    }

    /**
     * ajaxGet 新函数
     * @param url
     * @param data
     * @param callback
     */
    _codoonNative.prototype.ajaxGetNew = function(url, data, callback) {
        function ajaxFunction() {
            var xmlHttp
            try {
                xmlHttp = new XMLHttpRequest()
            } catch (e) {
                try {
                    // Internet Explorer
                    xmlHttp = new ActiveXObject('Msxml2.XMLHTTP')
                } catch (e) {
                    try {
                        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP')
                    } catch (e) {}
                }
            }
            return xmlHttp
        }

        var xhr = ajaxFunction()


        if (data) {
            var flag = /\?/.test(url)
            var _data = data
            if (data.constructor === Object) {
                var s = flag ? '' : '?'

                if (flag) {
                    var getData = url.split('?')
                    // ?号后面存在参数
                    if (getData[1]) {
                        s += '&'
                    }
                }

                for (var key in _data) {
                    s += key + '=' + _data[key] + '&'
                }
                url += s.slice(0, -1)
            } else {
                throw Error('ajaxGet data is must be Object')
            }
        }
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200 || xhr.status == 304) {
                    var data = xhr.responseText
                    callback (null, data)
                }
            }
        }

        xhr.open('GET', url, true)
        xhr.send (null)
    }

    /**
     * ajaxGet 函数 存在很多问题
     * @param url
     * @param data
     * @param callback
     */
    _codoonNative.prototype.ajaxGet = function(url, data, callback) {
        function reqListener() {
            if (callback) {
                var response = this.responseText
                try {
                    response = JSON.parse(response)
                } catch (e) {
                    console.log(e)
                }
                if (!response.status) {
                    return callback(response.description, response)
                }
                callback(null, response)
            }
        }
        if (data) {
            var flag = /\?/.test(url)
            var _data = data
            if (data.constructor === Object) {
                var s = flag ? '' : '?'


                if (flag) {
                    var getData = url.split('?')
                    // ?号后面存在参数
                    if (getData[1]) {
                        s += '&'
                    }
                }

                for (var key in _data) {
                    s += key + '=' + _data[key] + '&'
                }
                url += s.slice(0, -1)
            } else {
                throw Error('ajaxGet data is must be Object')
            }
        }
        var oReq = new XMLHttpRequest()
        oReq.withCredentials = true
        oReq.crossDomain = true
        oReq.addEventListener ('load', reqListener)
        oReq.open ('GET', url)
        oReq.send ()
    }

    /**
     *
     * @param url
     * @param data
     * @param callback
     */
    _codoonNative.prototype.ajaxPost = function(url, data, callback) {
        function reqListener() {
            var response = this.responseText
            try {
                response = JSON.parse(response)
            } catch (e) {
                console.log(e)
            }
            if (!response.status) {
                return callback(response.description, response)
            }
            callback(null, response)
        }
        if (data) {
            if (data.constructor !== Object) {
                throw Error('ajaxPost data is must be Object')
            }
        }

        function transformRequest(data) {
            var str = []
            for (var p in data)
                str.push (encodeURIComponent (p) + '=' + encodeURIComponent (data[p]))
            return str.join ('&')
        }
        var oReq = new XMLHttpRequest()
        oReq.withCredentials = true
        oReq.crossDomain = true
        oReq.addEventListener ('load', reqListener)
        oReq.open ('POST', url)
        oReq.setRequestHeader ('Content-Type', 'application/x-www-form-urlencoded')
        oReq.send (transformRequest (data))
    }

    /**
     * 从userAgent获取到系统版本,如果不在codoon里面，返回空字符串
     * @returns {*}
     */
    _codoonNative.prototype.requestAPPVersion = function() {
        var userAgent = window.navigator.userAgent
        if (this.isInCodoon ()) {
            var version = userAgent.split(' ')[0].split('(')[1]
            return version
        }
        return ''
    }

    /**
     * 判定是否在codoon里面
     * @return {boolean}
     */
    _codoonNative.prototype.isInCodoon = function() {
        var sUserAgent = window.navigator.userAgent
        var isInCodoon =
        (/CodoonSport/).test (sUserAgent) || (/sa-sdk-ios/i).test (sUserAgent)
        return isInCodoon
    }

    /**
     * 判定是否在codoon里面
     * @return {boolean}
     */
    _codoonNative.prototype.isInSmallRoutine = function() {
        var sUserAgent = window.navigator.userAgent
        var isInSmallRoutine = false
        if (sUserAgent.indexof ('MicroMessage') == -1) {
            //说明不在微信中
            isInSmallRoutine = false
        } else {
            wx.miniProgram.getEnv(function(res) {
                if (res.miniProgram) {
                    isInSmallRoutine = true
                } else {
                    isInSmallRoutine = false
                }
            })
        }
        return isInSmallRoutine
    }

    /**
     * 刷新当前view里页面 7.2版本支持
     * @return null
     */
    _codoonNative.prototype.refreshView = function() {
        return this.singleFunction('refresh_page')
    }

    /**
     * 关闭当前view 7.2版本支持
     * @return null
     */
    _codoonNative.prototype.closeView = function() {
        return this.singleFunction('close_page')
    }

    /**
     * 复制文字到剪贴板 7.2版本支持
     * @param options {text: ""}
     * @param callback
     * @return boolean
     */
    _codoonNative.prototype.copyText = function(options, callback) {
        this.callbackFunction('copy_text_callback', callback)
        return this.singleFunction ('copy_text', options)
    }

    /**
     * 关闭长按图片功能 (默认是开启的，若图片是二维码可识别二维码) 7.2版本支持
     * @return null
     */
    _codoonNative.prototype.closeLongClick = function() {
        return this.singleFunction('close_long_click')
    }

    /**
     * 分享按钮可以单独出现在webview右上角 7.6版本添加
     */
    _codoonNative.prototype.showTopShareButton = function() {
        return this.singleFunction('shift_top_button', {
            type: 'share'
        })
    }

    /**
     * 隐藏右上角的分享按钮  7.6版本添加
     */
    _codoonNative.prototype.hideTopShareButton = function() {
        return this.singleFunction('shift_top_button', {
            type: 'normal'
        })
    }

    /**
     * 检测用户网络状态
     * @param {boolean} true:开启 false:关闭
     * @return 2G\3G\4G\WIFI\NONE
     */
    _codoonNative.prototype.listenUserNetworkState = function(options, callback) {
        this.callbackFunction('listen_user_network_state', callback)
        return this.singleFunction ('switch_user_network_listener', options)
    }

    /**
     * 获得客户端提供的神策的预制属性
     * @param {*} callback
     */
    _codoonNative.prototype.getScDefaultInfo = function(callback) {
        this.callbackFunction('codoon_native_sc_info_callback', callback)
        return this.singleFunction ('codoon_native_sc_info')
    }

    /**
     * 目前只在文章列表使用
     * @param {boolean} true:开启 false:关闭
     * @return {state:0,portrait:"","create_time":"2016-11-11 21:23:21","content":"xxxx"}
     * 其中create_time 为客户端本地时间
     */
    _codoonNative.prototype.getArticleUserComment = function(options, callback) {
        this.callbackFunction('article_user_comment_callback', callback)
        return this.singleFunction ('switch_article_comment', options)
    }

    /**
     * 发送统计url给客户端，客户端发送给服务器 7.16.0增加
     */
    _codoonNative.prototype.sendMiaoZhenUrl = function(url) {
        return this.singleFunction('miaozhen_monitor', {
            url,
        })
    }

    /**
     * 设置IOS页面高度
     * @param options
     * @returns {*}
     */
    _codoonNative.prototype.nativeDidFinishAllRequest = function(options) {
        return this.singleFunction('didFinishAllRequest', options)
    }

    /**
     * 发送私信的接口
     */
    _codoonNative.prototype.sendPrivateMessage = function(options) {
        return this.singleFunction('sendPrivateMessage', options)
    }

    //2017-11-16 add new
    //注册分享点击回调函数
    _codoonNative.prototype.nativeShareClickCallback = function(callback) {
        this.callbackFunction('codoon_user_clicked_share_callback', callback)
    }

    //2017-11-28 add new
    /*
          callback(status, channel)
              status: 1 成功  0 失败
          */
    _codoonNative.prototype.nativeShareSuccessCallback = function(callback) {
        this.callbackFunction('codoon_user_share_result_callback', callback)
    }

    // 2018-04-04
    // 咕咚 版本 8.18
    // 2018-05-15
    // 咕咚 版本 8.24 增加 extra_outside_urls，Android在这个版本，改为字典
    /*
     * 老版本顺序必须保持这样，在8.24之前，Android那边是参数
     * outside_url, codoon_url, client_ip, extra_outside_urls
     */
    _codoonNative.prototype.adMonitor = function(options) {
        alert(3)
        if (
            (this.requestAPPVersion() && self.requestAPPVersion().length === 5 && self.requestAPPVersion() < '8.24') ||
            !this.requestAPPVersion()
        ) {
            if (this.iOS) {
                this.singleFunction('ad_monitor', options)
            } else {
                alert(2)
                this.singleFunction (
                    'ad_monitor',
                    options.outside_url,
                    options.codoon_url,
                    options.client_ip
                )
            }
        } else {
            alert(1)
            this.singleFunction ('ad_monitor', options)
        }
    }

    // 2018-05-09
    // 咕咚版本8.21
    // 分享小程序
    /**
     * @param {object} options
     * @key {string} sCodoonShareUrlLinks: 兼容最低版本的网页路径
     * @key {string} sCodoonSharePages: 		小程序路径
     * @key {Number} sCodoonShareUserId:		小程序原始Id
     * @key {string} sCodoonShareImages: 	小程序节点图片 （小于128K）
     * @key {string} sCodoonShareTitle: 		小程序title
     * @key {string} sCodoonShareDesc: 		小程序描述
     */
    _codoonNative.prototype.codoonShareXiaochengxuHandle = function(options) {
        if (!options.hasOwnProperty('sCodoonShareUserId')) {
            return alert('必须传入小程序sCodoonShareUserId字段')
        }

        var obj = {
            sCodoonShareUrlLinks: options.sCodoonShareUrlLinks || '',
            sCodoonSharePages: options.sCodoonSharePages || '',
            sCodoonShareUserId: options.sCodoonShareUserId || '',
            sCodoonShareImages: options.sCodoonShareImages || '',
            sCodoonShareTitle: options.sCodoonShareTitle || '',
            sCodoonShareDesc: options.sCodoonShareDesc || ''
        }

        return this.singleFunction('codoon_share_mini_handler', obj)
    }
    //触发客户端下载语音包
    _codoonNative.prototype.codoonDownloadParterVoice = function(options) {
        return this.singleFunction('codoon_download_voice', options)
    }
    //2018-07-23 add new
    //注册下载语音回调函数
    _codoonNative.prototype.codoonDownloadParterVoiceCallback = function(callback) {
        this.callbackFunction('codoon_download_voice_callback', callback)
    }

    // 上传又拍云
    _codoonNative.prototype.uploadUpai = function(file, cb) {
        if (!file) {
            return cb({
                status: false,
                data: '文件不存在'
            })
        }
        if (!_codoonNative.initUpai) {
            init()
        } else {
            callBack()
        }
        function init() {
            var urlAxios = '//unpkg.com/axios/dist/axios.min.js'
            var urlUpai = '//unpkg.com/upyun/dist/upyun.min.js'
            Promise.all ([
                loadScript (urlAxios),
                loadScript (urlUpai),
            ]).then (function () {
                _codoonNative.initUpai = true
                callBack ()
            })
        }
        function loadScript(url) {
            return new Promise(function(resolve, reject) {
                var script = document.createElement('script')
                script.type = 'text/javascript'
                script.src = url
                document.getElementsByTagName ('head')[0].appendChild (script)
                script.onload = function () {
                    resolve('success: ' + url)
                };
            })
        }
        function callBack() {
            var service = new upyun.Service('activity-codoon')
            var client = new upyun.Client (
                {
                    serviceName: 'activity-codoon'
                },
                function() {}
            )
            //  = new Date().getTime() + '.png'
            client.setBodySignCallback(function(ignore, params) {
                console.log(params)
                var query =
            'save-key=' + params['save-key'] + '&service=' + params.service
                var res
                /* return fetch (
            '//www.codoon.com/activity/v1/api/upai/sign?' + query
          ) */
                return this.$store.$api.get(
                    .get('/upai/sign', {
                        params: {
                            'save-key': params['save-key'],
                            service: params.service
                        }
                    })
                    .then(function(response) {
                        if (response.status !== 200) {
                            console.error('gen header sign faild!')
                            return;
                        }
                        return response.json()
                    })
                    .then(function(res) {
                        return res.data
                    })
            })


            var remoteName =
          '/fxd/' +
          new Date ().getTime () +
          '/' +
          (file.name || new Date ().getTime ())
            client.formPutFile (remoteName, file).then (function (res) {
                if (res.code === 200) {
                    return cb ({
                        status: true,
                        data: 'https://webapp.codoon.com' + remoteName,
                    })
          } 
                return cb ({
                    status: false,
                    data: res,
                })
          
        });
        }
    }

    // 初始化session
    var _native = new _codoonNative()
    if (_native.isInCodoon()) {
        _native.nativeGetUserToken(function(err, data) {
            var iframe = document.createElement('iframe')
            iframe.style.display = 'none'
            iframe.src =
          '//xmall.codoon.com/xmall/tokensession?token=' + data.access_token
            document.body.appendChild (iframe)
        })
    }

    // 导出对象
    var newCodoonNative = null
    var codoonNativeBridge = function(options) {
        if (!newCodoonNative || (options && options.needNew)) {
            newCodoonNative = new _codoonNative(options)
        }
        return newCodoonNative
    }

    if (!noGlabal) {
        window.codoonNativeBridge = codoonNativeBridge
    }
    return codoonNativeBridge
})
