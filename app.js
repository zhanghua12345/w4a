// app.js

import { login, getUser } from "@/api/login";
App({
  onLaunch() {
    // 获取系统信息
    this.getAppSystem();
    // 获取新版本信息
    this.getNew();
    // 获取code、用户信息
    this.getLogin();
  },
  getAppSystem() {
    //小程序该菜单按钮的布局位置信息
    let capsuleObj = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: (res) => {
        //顶部状态栏高度并定义全局变量
        var statusBarHeight = res.statusBarHeight;
        this.globalData.capsuleObj = capsuleObj;
        //获取title高度并定义全局变量
        this.globalData.titleHeight =
          statusBarHeight +
          capsuleObj.height +
          (capsuleObj.top - statusBarHeight) * 2;
      },
      failure() {},
    });
  },
  getNew() {
    if (wx.canIUse("getUpdateManager")) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        // console.log(res, "是否有新版本")
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: "更新提示",
              content: "新版本已经准备好，是否重启应用？",
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate();
                }
              },
            });
          });
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: "已经有新版本了哟~",
              content: "新版本已经上线，请您删除当前小程序，重新搜索打开",
            });
          });
        }
      });
    } else {
      wx.showModal({
        title: "提示",
        content:
          "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
      });
    }
  },
  getLogin() {
    const _this = this;
    wx.login({
      success: async function (res) {
        if (!res.code) {
          wx.showToast({
            title: "获取登录凭证失败，请稍后重试！",
            icon: "none",
            duration: 2000,
          });
          // 记录错误信息
        } else {
          // 处理正常情况
          const request = await login({ code: res.code });

          wx.setStorageSync("token", request.uid);
          const userInfo = await getUser();
          _this.globalData.userInfo = userInfo;
          if (_this.userInfoCallback) {
            _this.userInfoCallback(userInfo);
          }
        }
      },
      fail: function (err) {
        // 处理网络异常情况
      },
    });
  },
  globalData: {
    userInfo: null,
    capsuleObj: null,
    titleHeight: null,
  },
});
