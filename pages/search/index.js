// index.js

Page({
  data: {},
  onLoad() {
    this.setData({
      active: "a",
    });
  },

  openSearch() {
    wx.navigateTo({ url: "/pages/detail/detail?id=1" });
  },
});
