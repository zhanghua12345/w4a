// app.js
App({
  onLaunch() {
    //小程序该菜单按钮的布局位置信息
    let capsuleObj = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: (res) => {
        //顶部状态栏高度并定义全局变量
        var statusBarHeight = res.statusBarHeight;
        this.globalData.capsuleObj = capsuleObj;
        //获取title高度并定义全局变量
        this.globalData.titleHeight = statusBarHeight + capsuleObj.height + (capsuleObj.top - statusBarHeight) * 2;
      },
      failure() {}
    })
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null
  }
})