// index.js
const app = getApp();
const defaultAvatarUrl =
  "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0";

Page({
  data: {
    userInfo: null,
    list: [
      { name: "历史观看", icon: "icon-fire", url: "../history/index" },
      { name: "充值明细", icon: "icon-fire", url: "../recharge/index" },
      { name: "消费记录", icon: "icon-fire", url: "../consumption/index" },
      { name: "赠币记录", icon: "icon-fire", url: "../giftCoins/index" },
      { name: "联系客服", icon: "icon-fire", url: "../kefu/index" },
    ],
    showLogin: false,
    showPay: false,
  },
  async onLoad() {
    //判断是否获取到动态设置的globalData
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      });
    } else {
      // 声明回调函数获取app.js onLaunch中接口调用成功后设置的globalData数据
      app.userInfoCallback = (userInfo) => {
        if (userInfo != "") {
          this.setData({
            userInfo,
          });
        }
      };
    }
  },

  bindViewTap() {
    wx.navigateTo({
      url: "../logs/logs",
    });
  },
  login() {
    this.setData({
      showLogin: true,
    });
  },
  openPay() {
    console;
    this.setData({
      showPay: true,
    });
  },
  clone() {
    this.setData({
      showLogin: false,
      showPay: false,
    });
  },
  changeInfo(e) {
    this.setData({
      userInfo: e.detail.value,
    });
  },
  openDetail(event) {
    const url = event.currentTarget.dataset.item.url;
    console.log(url);
    wx.navigateTo({
      url,
    });
  },
});
