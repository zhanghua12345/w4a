// index.js
const app = getApp();
import { pageList, moduleList } from "@/api/home";
import { PlayerManager } from "@/utils/playerManager";
Page({
  data: {
    navbarData: {
      showCapsule: 1, //是否显示左上角图标
      returnType: 1, //是否显示返回图标 不传不显示
      homeType: 1, //是否显示主页图标 不传不显示
      title: "古言网络", //中间标题
      bgColor: "#fff",
    },
    opacity: 0,
    capsuleObj: null,
    bannerList: null,
    bestList: null,
    starsList: null,
    history: null,
    showHistory: true,

    page: 1,
    top: 1,
    praiseList: null,
    loadStatus: "loading", // loading loadmore nomore
  },

  onShareAppMessage() {
    return {
      title: "古言网络",
      path: "pages/home/index",
      loadmore: "loadmore",
    };
  },

  async onLoad() {
    this.setData({
      capsuleObj: app.globalData.capsuleObj,
    });
    const res = await pageList();
    const newList = await moduleList({
      page: this.data.page,
      top: this.data.top,
    });
    this.setData({
      bannerList: res.ads,
      bestList: res.module1,
      starsList: res.module2,
      praiseList: newList.module,
      history: res.history,
      page: this.data.page + 1,
      loadStatus: newList.module?.length < 5 ? "nomore" : "loadmore",
    });
  },

  // 监听屏幕滚动，获取滚动距离
  onPageScroll: function (e) {
    let that = this;
    var opacity,
      scrollTop = e.scrollTop;
    // 根据滚动距离设置渐隐渐显
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

  //监听下拉刷新
  onPullDownRefresh() {
    console.log("监听用户下拉刷新");
    var _this = this;
    this.setData({
      bannerList: [],
      bestList: [],
      starsList: [],
      praiseList: [],
      history: [],
      loadStatus: "loading",
    });
    setTimeout(async () => {
      const res = await pageList();
      const newList = await moduleList({
        page: 1,
        top: _this.data.top,
      });
      _this.setData({
        bannerList: res.ads,
        bestList: res.module1,
        starsList: res.module2,
        praiseList: newList.module,
        history: res.history,
        page: 2,
        loadStatus: newList.module?.length < 5 ? "nomore" : "loadmore",
        showHistory: true,
      });
      wx.stopPullDownRefresh();
    }, 500);
  },

  // 监听上拉加载
  async onReachBottom() {
    console.log("监听用户上拉加载");
    if (this.data.loadStatus !== "nomore") {
      this.setData({
        loadStatus: "loading",
      });
      const newList = await moduleList({
        page: this.data.page,
        top: this.data.top,
      });
      this.setData({
        loadStatus: newList.module.length < 5 ? "nomore" : "loadmore",
        praiseList: this.data.praiseList.concat(newList.module),
        page: this.data.page + 1,
      });
    }
  },

  // 点击顶部搜索
  openSearch() {
    console.log(454);
    wx.navigateTo({
      url: "../search/index",
    });
  },

  // 关闭历史弹框
  historyClone() {
    this.setData({
      showHistory: false,
    });
  },

  // 打开视频
  openVideo(event) {
    const data = event.currentTarget.dataset.item;
    if (data.wx_drama_id) {
      PlayerManager.navigateToPlayer({
        srcAppid: "wx2ab73633e3b9fcbf",
        dramaId: data.wx_drama_id,
      });
    } else {
      uni.navigateTo({
        url: `/pages/video/index?sid=${data.bookid || data.id}`,
      });
    }
  },
});
