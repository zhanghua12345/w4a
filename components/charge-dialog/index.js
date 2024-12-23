var plugin = requirePlugin("playlet-plugin");

import { urlParamsToObject } from "@/utils/utils.js";
import { getUser } from "@/api/login";
import {
  paysetting,
  iosPayment,
  getmentplanconf,
  appthirdpay,
  androidpaylog,
  payback,
} from "@/api/my";
import { newvideoread, bs } from "@/api/pay";

Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    playerId: {
      type: String,
      value: "",
    },
    srcAppid: {
      type: String,
      value: "",
    },
    dramaId: {
      type: String,
      value: "",
    },
    serialNo: {
      type: Number,
      value: 0,
    },
    extParam: {
      type: String,
      value: "",
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    _isInitChargeDialog: false,
    chargeList: [],
    selectIndex: -1,

    newExtParam: {},
    list: [],
    userInfo: null,
    iosStatus: null,
    uid: wx.getStorageSync("token"),
    showCenter: true,
  },
  lifetimes: {
    attached() {
      this.initChargeDialog();
    },
    // detached() {
    //   const pm = this.getPlayerManager()
    //   if (pm) {
    //     // 注册弹窗显示事件
    //     pm.onShowChargeDialog(this.onShowChargeDialog.bind(this))
    //     // 注册弹窗隐藏事件
    //     pm.onHideChargeDialog(this.onHideChargeDialog.bind(this))
    //   }
    // }
  },
  observers: {
    serialNo(serialNo) {
      // 当集数发生改变的时候，触发此函数
    },
    playerId(playerId) {
      console.log("this.initChargeDialog", playerId);
      this.initChargeDialog();
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    initChargeDialog() {
      // 如果播放器页面还没有playerId，返回
      if (!this.data.playerId) return;
      // 只需要初始化一次
      if (this.data._isInitChargeDialog) return;
      this.data._isInitChargeDialog = true;
      this.setData({
        newExtParam: urlParamsToObject(decodeURIComponent(this.data.extParam)),
      });
      const pm = this.getPlayerManager();
      if (pm) {
        // 注册弹窗显示事件
        pm.onShowChargeDialog(this.onShowChargeDialog.bind(this));
        // 注册弹窗隐藏事件
        pm.onHideChargeDialog(this.onHideChargeDialog.bind(this));
      }
    },
    getPlayerManager() {
      return plugin.PlayletManager.getPageManager(this.data.playerId);
    },

    // all
    async onShowChargeDialog() {
      const list = await paysetting();
      const userInfo = await getUser({
        showLoading: false,
      });
      const res = await bs({
        showLoading: false,
      });
      this.setData({
        list,
        userInfo,
        platform: wx.getSystemInfoSync().platform,
        iosStatus: res.status,
      });
    },

    openAgreement() {
      const pm = this.getPlayerManager();
      pm.navigateTo({
        url: "/pages/agreement/index",
      });
    },
    openPurchaseNotes() {
      const pm = this.getPlayerManager();
      pm.navigateTo({
        url: "/pages/purchaseNotes/index",
      });
    },

    // 支付功能
    async pay(event) {
      console.log(1);
      const item = event.currentTarget.dataset.item;
      const bsPayItem = await iosPayment();
      const platform = wx.getSystemInfoSync().platform;
      if (platform === "ios" && bsPayItem.status === 1) {
        wx.showToast({
          title: "暂不支持IOS支付",
          icon: "none",
        });
        return;
      }
      const param = {
        id: item.id,
        isback: item.isBack ? item.isBack : 0,
        dramaId: dramaId,
      };
      if (platform !== "ios") {
        const payResult = await getmentplanconf();
        console.log(payResult);
        if (payResult.Paymentplan === 1) {
          wx.openEmbeddedMiniProgram({
            appId: payResult.zzfhaveappid,
            path:
              "pages/index/index?content=" +
              JSON.stringify({
                Paydomain: payResult.Paydomain,
                uid: this.data.uid,
                ...param,
              }),
            extraData: {
              Paydomain: payResult.Paydomain,
              uid: this.data.uid,
              ...param,
            },

            success(res) {
              // 打开成功
            },
          });
          return;
        } else if (payResult.Paymentplan === 2) {
          this.$emit("onShowInit", "onShowInit");
          const res = await appthirdpay({ ...param, platform });
          const result = res.payinfo;
          console.log(result);
          wx.openEmbeddedMiniProgram({
            appId: result.appId,
            path: result.prePayTn,

            success(res) {
              // 打开成功
              this.isPayRefresh();
            },
          });
          return;
        } else if (payResult.Paymentplan === 3) {
          const SDKVersion = wx.getSystemInfoSync().SDKVersion;
          if (
            this.compareVersion(SDKVersion, "2.19.2") >= 0 ||
            wx.canIUse("requestVirtualPayment")
          ) {
            const res = await appthirdpay({ ...param, platform });
            const result = res.payinfo;
            wx.requestVirtualPayment({
              signData: JSON.stringify(result.signData),
              paySig: result.paySig || "",
              signature: result.signature || "",
              mode: result.mode,
              success: async (res) => {
                console.log("==3===");
                wx.showToast({
                  title: "支付成功",
                  duration: 2000,
                });
                this.isPayRefresh();
                app.getLogin();
                this.triggerEvent("clone");
              },
              fail: async ({ errMsg, errCode }) => {
                await androidpaylog({
                  errMsg,
                  errCode,
                });
              },
            });
          } else {
            wx.showToast({
              title: "当前用户的客户端版本不支持",
              icon: "none",
            });
          }
          return;
        }
      }
      const res = await appthirdpay({ ...param, platform });
      const result = res.payinfo;
      wx.requestPayment({
        appId: result.appId,
        timeStamp: result.timeStamp,
        nonceStr: result.nonceStr,
        package: result.package,
        signType: result.signType,
        paySign: result.paySign,
        success: (e) => {
          wx.showToast({
            title: "支付成功",
            duration: 2000,
          });
          this.isPayRefresh();
        },
        fail: () => {
          wx.showToast({
            title: "支付失败",
            duration: 2000,
            icon: "none",
          });
          // this.backShow = false;
        },
      });
    },

    // 支付或看广告后的回调
    isPayRefresh() {
      const pm = this.getPlayerManager();
      const dramaId = this.data.dramaId;
      const serialNo = this.data.serialNo;
      const srcAppid = this.data.srcAppid;
      const tData = {
        srcAppid,
        dramaId,
        adunlocking: 1,
        serialNo,
      };
      const tParams = {
        data: tData,
      };

      newvideoread(tParams).then((res) => {
        pm.isCanPlay({
          data: res.encryptData,
          serialNo,
        });
        pm.hideChargeDialog();
      });
    },

    // 支付js里面的参数处理
    compareVersion(_v1, _v2) {
      if (typeof _v1 !== "string" || typeof _v2 !== "string") return 0;
      const v1 = _v1.split(".");
      const v2 = _v2.split(".");
      const len = Math.max(v1.length, v2.length);

      while (v1.length < len) {
        v1.push("0");
      }
      while (v2.length < len) {
        v2.push("0");
      }
      for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1[i], 10);
        const num2 = parseInt(v2[i], 10);

        if (num1 > num2) {
          return 1;
        } else if (num1 < num2) {
          return -1;
        }
      }
      return 0;
    },

    onHideChargeDialog() {
      console.log("onHideChargeDialog");
      // this.videoAd.destroy();
    },

    //关闭广告
    closeOpenAreaLeft() {
      // 关闭
      const pm = this.getPlayerManager();
      pm.hideChargeDialog();
    },

    destroyed() {
      console.log("销毁");
      this.onHideChargeDialog();
    },
    deactivated() {
      console.log("deactivated");
      this.onHideChargeDialog();
    },
  },
});
