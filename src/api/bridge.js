//import store from './../store'
var CodoonNativeBridge = window.codoonNativeBridge
var bridge = new CodoonNativeBridge()

//分享渠道
const shareDestination = {
    codoonTimeline: true,
    codoonGrFriend: true,
    weixinToup: false,
    weixinTooTimeline: true,
    sinaWeibo: false,
    tencentQQ: false,
    tencentQzone: false
}

const options = {
    shareImgUrl: 'https://activity-codoon.b0.upaiyun.com/lavida/upload/share.png', //分享图片
    shareLineLink: 'https://www.codoon.com/activity/v1/lavida_codoon_run/sharefriend.html', //分享站外链接
    shareDescContent:
        '全新一代朗逸为每位跑者持久助力，让理想生活，更进一步。现在就来“咕咚”参与里程挑战，赢取丰富好礼！', //分享内容
    shareCodoonLineLink: 'https://www.codoon.com/activity/v1/lavida_codoon_run/index.html', //分享站内链接
    shareTitle: '每一步，都离目标更进一步！' //分享标题
}
//按钮分享
export const goSharefriend = options => {
    bridge.nativeCustomerShare({
        sCodoonShareImgUrl: options.shareImgUrl,
        sCodoonShareLineLink: options.shareLineLink,
        sCodoonShareDescContent: options.shareDescContent,
        sCodoonShareCodoonLineLink: options.shareCodoonLineLink,
        sCodoonShareTitle: options.shareTitle,
        oCodoonShareDestination: shareDestination
    })
}

//右上角分享
export const shareDefaultTop = optionsTop => {
    bridge.nativeTopButtonShare({
        sCodoonShareImgUrl: optionsTop.shareImgUrl,
        sCodoonShareLineLink: optionsTop.shareLineLink,
        sCodoonShareDescContent: optionsTop.shareDescContent,
        sCodoonShareCodoonLineLink: optionsTop.shareCodoonLineLink,
        sCodoonShareTitle: optionsTop.shareTitle,
        oCodoonShareDestination: {
            codoonTimeline: true,
            codoonGroup: true,
            weixinToFriend: true,
            weixinToTimeline: true,
            sinaWeibo: true,
            tencentQQ: true,
            tencentQzone: true
        }
    })
}

//图片分享
export const goShareImg = shareImg => {
    bridge.nativeCustomerShare({
        sCodoonShareImgUrl: shareImg,
        sCodoonShareLineLink: '',
        sCodoonShareCodoonLineLink: '',
        sCodoonShareDescContent: '',
        sCodoonShareTitle: '',
        oCodoonShareDestination: shareDestination,
        sCodoonShareContentType: 1
    })
}

// 分享后回调
export const shareCb = callback => {
    bridge.nativeShareClickCallback(function(err, response) {
        // alert("测试，上线会删掉。err:"+err + ",response"+ JSON.stringify(response))
        if (err) return alert(err)
        callback()
    })
}

//微信二次分享
export const shareInWx = optionsTop => {
    wxShare.config({
        title: optionsTop.shareTitle,
        desc: optionsTop.shareDescContent,
        link: optionsTop.shareLineLink,
        imgUrl: optionsTop.shareImgUrl
    })
}

//是否在app内
export const isInCodoon = () => {
    if (window.location.href.indexOf('localhost') !== -1) {
        return true
    }
    return bridge.isInCodoon()
}

//跳地址组件
export const jumpToAddressNew = (eventid, callback = function() {}) => {
    bridge.jumpToAddressManageNew(eventid, callback)
}

// 跳外链
export const jumpToUrl = url => {
    bridge.jumpNative(
        {
            type: 'webView',
            value: url
        },
        () => {}
    )
}

// 跳转至话题
export const jumpToDiscuss = callback => {
    bridge.jumpNative(
        {
            type: 'webView',
            value: 'codoon://www.codoon.com/feed/feedlabel?label_id='
        },
        callback
    )
}
// 去运动
export const jumpToRun = (options, callback) => {
    bridge.jumpNative(
        {
            type: 'webView',
            value: 'codoon://www.codoon.com/sport/preview_goal?sportType=1&goalType=0&goalValue=0'
        },
        () => {}
    )
}

// 上传图片
export const nativeUploadImgs = callback => {
    return bridge.nativeUploadImg(callback)
}

// 跳 Native 页面
export const jumpNative = (options, callback) => {
    return bridge.jumpNative(options, callback)
}

// 下载图片
export const downloadImg = _url => {
    return bridge.nativeDownloadImg({ urls: [_url] }, res => {})
}

// 获取gps
export const getGps = cb => {
    return bridge.nativeGetGps(cb)
}

// 跳 Native 页面
export const moreActivity = cb => {
    bridge.jumpNative(
        {
            type: 'webView',
            value: 'https://race.codoon.com/race/616'
        },
        () => {}
    )
}

export const uploadFile = (file, callback) => {
    return bridge.uploadUpai(file, callback)
}
