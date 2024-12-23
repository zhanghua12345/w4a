var plugin = requirePlugin("playlet-plugin");

import { urlParamsToObject, objectToQueryString } from "./utils";

import { newvideoread, addkeep, chasingdramadel } from "@/api/pay";
// 点击按钮触发此函数跳转到播放器页面
function navigateToPlayer(obj) {
  // 下面的${dramaId}变量,需要替换成小程序管理后台的媒资管理上传的剧的dramaId
  // 变量${srcAppid}是提审方appid
  // 变量${serialNo}是活动的页面路径
  // 变量${extParam}是分享参数，分享的卡片和二维码会在分享的链接上携带此参数
  const { extParam, dramaId, srcAppid } = obj;
  wx.navigateTo({
    url: `plugin-private://wx94a6522b1d640c3b/pages/playlet/playlet?dramaId=${dramaId}&srcAppid=${srcAppid}&extParam=${
      extParam || ""
    }`,
  });
}

const proto = {
  // data: {
  //   // 可通过this.data访问
  //   playerId: "",
  //   arr: [],
  //   b: null,
  // },
  _onPlayerLoad(info) {
    // console.log("onPlayerLoad info", info, "data", this.data);
    // this.data.playerId = info.playerId;
    const pm = plugin.PlayletManager.getPageManager(info.playerId);
    this.pm = pm;
    // encryptedData是经过开发者后台加密后(不要在前端加密)的数据，具体实现见下面的加密章节
    this.getEncryptData({ serialNo: info.serialNo }).then((res) => {
      const startSerialNo = res.videoinfo.start_serial_no;
      const endSerialNo = res.videoinfo.end_serial_no;
      const name = res.videoinfo.skits_library_name;
      const price = res.videoinfo.price;
      const codeOrder = res.videoinfo.codeOrder || 0;
      // encryptedData是后台加密后的数据，具体实现见下面的加密章节
      pm.setCanPlaySerialList({
        data: res.encryptData,
        freeList: [
          {
            start_serial_no: startSerialNo,
            end_serial_no: endSerialNo,
          },
        ], // 1~10集是免费剧集
      });
      const objParams = {
        name: name,
        startSerialNo: startSerialNo,
        endSerialNo: endSerialNo,
        price: price,
        // sid: sid,
        weiXinCodeOrder: codeOrder,
        // isad: isad
      };
      const extParams = objectToQueryString(objParams);
      pm.setExtParam(extParams);
    });
    pm.onCustomEvent("paySuccess", this.onCheckIsCanPlay);

    // 需要解锁的事件
    pm.onCheckIsCanPlay(this.onCheckIsCanPlay);
    pm.onDataReport(this.isOnDataReport);

    pm.onBack((e) => {
      const pages = getCurrentPages();
      const isBack = pages[pages.length - 2];
      if (!isBack) {
        pm.switchTab({
          url: "/pages/index/index",
        });
      } else {
        pm.navigateBack();
      }
    });

    pm.setDramaFlag({
      share: true,
      withShareTicket: true,
    });

    pm.setVisualEffectOnCapture({
      visualEffect: "hidden",
    });

    plugin
      .getShareParams()
      .then((res) => {
        const extParam = decodeURIComponent(res.extParam);
        const enterOptions = wx.getEnterOptionsSync();
      })
      .catch((err) => {});

    // this._initShare();
    // 参考文档章节“数据上报”
    // pm.onDataReport((obj) => {
    //   if (
    //     obj.event === playletPlugin.REPORT_DATA_EVENTS.VIDEO_PLAY ||
    //     obj.event === playletPlugin.REPORT_DATA_EVENTS.CHANGE_SERIAL ||
    //     obj.event === playletPlugin.REPORT_DATA_EVENTS.VIDEO_PAUSE
    //   ) {
    //     console.log(">>>>onDataReport obj", obj);
    //   }
    // });
    // // 设置右侧固定运营位置跳转路径
    // pm.setActivityInfo({
    //   url: "",
    // });
    // // 设置运营区域
    // pm.updateOpenArea({
    //   showLeft: false,
    //   showRight: false,
    //   leftsideAreaList: [
    //     {
    //       left: 16, // 类似绝对定位的样式
    //       top: 20,
    //       width: 72,
    //       height: 32,
    //     },
    //   ],
    //   ext: "extInfo",
    // });
  },
  // _initShare() {
  //   const pm = this.pm;
  //   // 关于分享的处理
  //   // 开启分享以及withShareTicket
  //   pm.setDramaFlag({
  //     share: true,
  //     withShareTicket: true,
  //   });
  //   // 获取分享参数,页面栈只有短剧播放器一个页面的时候可获取到此参数
  //   // 例如从分享卡片进入、从投流广告直接跳转到播放器页面，从二维码直接进入播放器页面等情况
  //   playletPlugin
  //     .getShareParams()
  //     .then((res) => {
  //       console.log("getLaunch options query res", res);
  //       // 关于extParam的处理，需要先做decodeURIComponent之后才能得到原值
  //       const extParam = decodeURIComponent(res.extParam);
  //       console.log("getLaunch options extParam", extParam);
  //       // 如果设置了withShareTicket为true，可通过文档的方法获取更多信息
  //       // https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/share.html
  //       const enterOptions = wx.getEnterOptionsSync();
  //       console.log("getLaunch options shareTicket", enterOptions.shareTicket);
  //     })
  //     .catch((err) => {
  //       console.log("getLaunch options query err", err);
  //     });
  //   // 设置分享参数
  //   pm.setExtParam("scene");
  //   // 和充值弹窗交互
  //   pm.onCustomEvent(
  //     "chargeDialog:chargeSuccess",
  //     this.onChargeDialogSuccess.bind(this)
  //   );
  // },
  onCheckIsCanPlay(param) {
    var serialNo = param.serialNo;
    this.getEncryptData(param).then((res) => {
      const codeOrder = res.videoinfo.codeOrder || 0;
      if (codeOrder && parseFloat(serialNo) >= parseFloat(codeOrder)) {
        const weiXinCode = wx.getStorageSync("weiXinCode");
        const option = {
          dramaId: param.dramaId,
        };
        const ext = objectToQueryString(option);
        const isExt = encodeURIComponent(ext);
        if (!weiXinCode[param.dramaId]) {
          this.pm.pause();
          this.pm.updateOpenArea({
            showLeft: true,
            ext: isExt,
          });
        } else if (res.videoinfo.chackpay != 1) {
          this.pm.showChargeDialog();
        }
      } else if (res.videoinfo.chackpay != 1) {
        this.pm.showChargeDialog();
      }
      this.pm.isCanPlay({
        data: res.encryptData,
        serialNo: serialNo,
      });
    });
  },
  getEncryptData(info) {
    wx.showLoading({
      title: "加载中",
      mask: true,
    });
    let param = {};
    const { extParam, ...newInfo } = info;
    if (extParam) {
      let extParam_a = decodeURIComponent(extParam);
      param = urlParamsToObject(extParam_a);
    }
    const { srcAppid, dramaId } = this.pm.getInfo();

    return new Promise((resolve, reject) => {
      const newConfig = {
        srcAppid,
        dramaId,
        ...param,
        ...newInfo,
      };
      newvideoread(newConfig)
        .then((res) => {
          wx.hideLoading();
          resolve(res);
        })
        .catch((e) => {
          wx.hideLoading();
          reject(e);
        });
    });
  },
  getKeep(vn) {
    const params = {
      dramaId: vn.dramaId,
    };
    if (vn.event == "FAV") {
      addkeep(params);
    } else if (vn.event == "UNFAV") {
      chasingdramadel(params);
    }
  },
  isOnDataReport(vn) {
    const serialNo = vn.serialNo;
    const extParam = vn.extParam || {};
    const extParam_a = decodeURIComponent(extParam);
    const isExtParam = urlParamsToObject(extParam_a);
    const weiXinCodeOrder = isExtParam.weiXinCodeOrder || 0;
    if (
      weiXinCodeOrder &&
      weiXinCodeOrder !== "0" &&
      parseFloat(serialNo) >= parseFloat(weiXinCodeOrder)
    ) {
      const weiXinCode = wx.getStorageSync("weiXinCode");
      const option = {
        dramaId: vn.dramaId,
      };
      const ext = objectToQueryString(option);
      const isExt = encodeURIComponent(ext);
      if (!weiXinCode[vn.dramaId]) {
        this.pm.pause();
        this.pm.updateOpenArea({
          showLeft: true,
          ext: isExt,
        });
      }
    }

    if (vn.event == "FAV" || vn.event == "UNFAV") {
      this.getKeep(vn);
    }
  },
};
function PlayerManager() {
  var newProto = Object.assign({}, proto);
  for (const k in newProto) {
    if (typeof newProto[k] === "function") {
      this[k] = newProto[k].bind(this);
    }
  }
}

PlayerManager.navigateToPlayer = navigateToPlayer;
export { PlayerManager };
