// index.js
import { discoverList, deleteDiscover } from "@/api/home";
Page({
  data: {
    list: null,
    loadStatus: "loading", // loading nomore
    isEdit: false,
  },

  onLoad() {
    this.getList();
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
    this.getList();
  },
  editChage() {
    this.setData({
      isEdit: !this.data.isEdit,
    });
  },
  async delete(event) {
    const _this = this;
    const item = event.currentTarget.dataset.item;
    console.log(item);
    deleteDiscover({ dramaId: item.wx_drama_iderrorCode })
      .then((data) => {
        console.log(data);
        wx.showToast({
          title: "删除成功",
          icon: "none",
          duration: 2000,
        });
        const index = _this.data.list.findIndex((r) => r.id === item.id);
        _this.data.list.splice(index, 1);
        this.setData({
          list: _this.data.list,
        });
      })
      .catch(() => {
        wx.showToast({
          title: "删除失败",
          icon: "none",
          duration: 2000,
        });
      });
  },
  // 接口调用
  getList() {
    const _this = this;
    setTimeout(async () => {
      const list = await discoverList();
      _this.setData({
        list: list.bookcase,
        loadStatus: "nomore",
      });
    }, 200);
  },
});
