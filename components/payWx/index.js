// components/payWx/index.js
import {
  paysetting,
  iosPayment,
  getmentplanconf,
  appthirdpay,
  androidpaylog,
  payback,
} from "@/api/my";
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {},
    },
    show: {
      type: Boolean,
      observer: function (newVal, oldVal) {
        this.setData({
          isPayActive: true,
        });
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [],
    backInfo: null,
    uid: wx.getStorageSync("token"),
    showCenter: false,
    isPayActive: true,
  },

  //  进入页面获取全局变量
  attached: async function () {
    const list = await paysetting({
      PersonalCenter: 1,
    });
    const backInfo = await payback({
      PersonalCenter: 1,
    });

    this.setData({
      list,
      backInfo,
    });
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 支付功能
    async pay(event) {
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
        jid: this.info?.id || "",
        sid: this.info?.sid || "",
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
                app.getLogin();
                this.onClose(1);
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
    // 参数指是否是支付完成
    // 如果弹框是打开的：如果支付完成关闭支付框，全局赋值(以后再也不打开)
    // 如果弹框是关闭的，判断是否全局赋值，是否要打开弹框
    onClose(isPay) {
      console.log(isPay, app.globalData.isPayActive);

      if (this.data.showCenter) {
        if (isPay === 1) app.globalData.isPayActive = false;
        this.setData({
          showCenter: false,
        });
      } else {
        if (
          app.globalData.isPayActive &&
          this.data.isPayActive &&
          isPay !== 1
        ) {
          this.setData({
            showCenter: true,
            isPayActive: false,
          });
        } else {
          this.triggerEvent("clone");
        }
      }
    },
    openAgreement() {
      wx.navigateTo({
        url: "../../pages/agreement/index",
      });
    },
    openPurchaseNotes() {
      wx.navigateTo({
        url: "../../pages/purchaseNotes/index",
      });
    },
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
  },
});
