// index.js

Page({
  data: {
    active: "",
    navbarData: {
      showCapsule: 1, //是否显示左上角图标
      returnType: 1, //是否显示返回图标 不传不显示
      homeType: 1, //是否显示主页图标 不传不显示
      title: "古言网络", //中间标题
      bgColor: "#f8f8f8",
    },
    opacity: 0,
    showNav: false,
  },
  onLoad() {
    this.setData({
      active: "a",
    });
  },
  //监听屏幕滚动，获取滚动距离
  onPageScroll: function (e) {
    this.scrollTop = e.scrollTop;
    let show = false;
    //根据我们要的滚动距离设置渐隐渐显
    //滚动小于115时不显示，当大于115小于200时显示并根据距离调节透明度opacity
    //为了渐隐渐显平滑使用距离进行计算
    if (e.scrollTop <= 50) {
      show = false;
    } else {
      show = true;
    }
    if (show != this.showNav) {
      this.setData({
        showNav: show,
      });
    }
  },
  onChange(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: "none",
    });
  },
});
