// index.js
const app = getApp();
Page({
  onShareAppMessage() {
    return {
      title: "古言网络",
      path: "pages/home/index",
      loadmore: "loadmore",
    };
  },
  data: {
    background: ["demo-text-1", "demo-text-2", "demo-text-3"],
    navbarData: {
      showCapsule: 1, //是否显示左上角图标
      returnType: 1, //是否显示返回图标 不传不显示
      homeType: 1, //是否显示主页图标 不传不显示
      title: "古言网络", //中间标题
      bgColor: "#fff",
    },
    opacity: 0,
    capsuleObj: null,
  },
  onLoad() {
    console.log(app.globalData.capsuleObj);
    this.setData({
      capsuleObj: app.globalData.capsuleObj,
    });
  },
  //监听屏幕滚动，获取滚动距离
  onPageScroll: function (e) {
    let that = this;
    var opacity,
      scrollTop = e.scrollTop;
    //根据我们要的滚动距离设置渐隐渐显
    //滚动小于115时不显示，当大于115小于200时显示并根据距离调节透明度opacity
    //为了渐隐渐显平滑使用距离进行计算
    if (scrollTop <= 115) {
      opacity = 0;
    } else if (scrollTop <= 200) {
      opacity = (scrollTop - 115) / 100;
    } else {
      opacity = 1;
    }
    that.setData({
      opacity: opacity,
    });
  },
  openSearch() {
    console.log(454);
    wx.navigateTo({
      url: "../search/index",
    });
  },
});
