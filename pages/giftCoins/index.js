// index.js
import { givelist } from "@/api/my";
Page({
  data: {
    list: null,
    loadStatus: "loading", // loading loadmore nomore
    isEdit: false,
    page: 1,
  },

  onLoad() {
    this.getList({
      page: this.data.page,
    });
  },

  //监听下拉刷新
  async onPullDownRefresh() {
    console.log("监听用户下拉刷新");
    var _this = this;
    this.setData({
      list: [],
      loadStatus: "loading",
    });
    wx.stopPullDownRefresh();
    this.getList({
      page: 1,
    });
  },

  // 监听上拉加载
  async onReachBottom() {
    console.log("监听用户上拉加载");
    if (this.data.loadStatus !== "nomore") {
      this.setData({
        loadStatus: "loading",
      });
      this.getList({
        page: this.data.page,
      });
    }
  },

  // 接口调用
  getList(even) {
    const _this = this;
    setTimeout(async () => {
      const list = await givelist(even);
      _this.setData({
        loadStatus: list.length < 5 ? "nomore" : "loadmore",
        list: (_this.data.list || []).concat(list),
        page: even.page + 1,
      });
    }, 200);
  },
});
