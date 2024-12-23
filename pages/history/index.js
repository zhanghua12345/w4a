// index.js
import { historyList } from "@/api/my";
import { addDiscover, deleteDiscover } from "@/api/home";
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

  discoverClick(event) {
    const _this = this;
    const item = event.currentTarget.dataset.item;
    const index = event.currentTarget.dataset.index;
    if (!item.bookcase) {
      this.addDis(item, index);
    } else {
      this.deleteDis(item, index);
    }
  },

  // 添加收藏
  async addDis(item, index) {
    const _this = this;
    addDiscover({ dramaId: item.wx_drama_id })
      .then((data) => {
        wx.showToast({
          title: "收藏成功",
          icon: "none",
          duration: 2000,
        });
        _this.data.list[index].bookcase = 1;
        this.setData({
          list: _this.data.list,
        });
      })
      .catch(() => {
        wx.showToast({
          title: "收藏失败",
          icon: "none",
          duration: 2000,
        });
      });
  },

  // 取消收藏
  async deleteDis(item, index) {
    const _this = this;
    deleteDiscover({ dramaId: item.wx_drama_id })
      .then((data) => {
        wx.showToast({
          title: "取消收藏",
          icon: "none",
          duration: 2000,
        });
        _this.data.list[index].bookcase = 0;
        this.setData({
          list: _this.data.list,
        });
      })
      .catch(() => {
        wx.showToast({
          title: "取消收藏失败",
          icon: "none",
          duration: 2000,
        });
      });
  },
  // 接口调用
  getList(even) {
    const _this = this;
    setTimeout(async () => {
      const list = await historyList(even);
      _this.setData({
        loadStatus: list.length < 5 ? "nomore" : "loadmore",
        list: (_this.data.list || []).concat(list),
        page: even.page + 1,
      });
    }, 200);
  },
});
