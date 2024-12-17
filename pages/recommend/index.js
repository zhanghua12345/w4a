// index.js
import { moduleList } from "@/api/home";
Page({
  data: {
    top: 2,
    page: 1,
    list: null,
    loadStatus: "loading", // loading loadmore nomore
  },

  onLoad() {
    this.getList({
      page: this.data.page,
      top: this.data.top,
    });
  },

  // 监听屏幕滚动，获取滚动距离
  onPageScroll: function (e) {
    // 根据滚动距离设置渐隐渐显
    if (e.scrollTop <= 115 && this.data.showNav) {
      this.setData({
        showNav: false,
      });
    } else if (e.scrollTop > 115 && !this.data.showNav) {
      this.setData({
        showNav: true,
      });
    }
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
      top: _this.data.top,
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
        top: this.data.top,
      });
    }
  },

  // 接口调用
  getList(data) {
    const _this = this;
    setTimeout(async () => {
      const list = await moduleList(data);
      _this.setData({
        list: (_this.data.list || []).concat(list.module),
        page: data.page + 1,
        loadStatus: list.module?.length < 5 ? "nomore" : "loadmore",
        top: data.top,
      });
    }, 200);
  },

  onChange(event) {
    this.setData({
      list: [],
      loadStatus: "loading",
    });
    this.getList({
      page: 1,
      top: event.detail.name,
    });
  },
});
