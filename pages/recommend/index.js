// index.js

Page({
  data: {
    active: 0,
    navbarData: {
      showCapsule: 1, //是否显示左上角图标
      returnType: 1, //是否显示返回图标 不传不显示
      homeType: 1, //是否显示主页图标 不传不显示
      title: '古言网络' ,//中间标题
      bgColor:'#f8f8f8'
    },
    opacity: 0,
  },
  onChange(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: 'none',
    });
  },
})
