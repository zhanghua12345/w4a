const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    navbarData: { //   由父页面传递的数据，变量名字自命名
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {}
    },
    // 是否使用插槽，默认不启用,值为true启用
    slotType: {
      type: Boolean,
      value: false
    },
    // 背景颜色                                                                                                                                   
    bgColor: {
      type: String,
      value: '#f8f8f8'
    },
    // 字体颜色
    Color: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  //  进入页面获取全局变量
  attached: function () {
    this.setData({
      titleHeight: app.globalData.titleHeight,
      capsuleObj: app.globalData.capsuleObj
    })
  },

  options: {
    multipleSlots: true, //开启多slot
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**返回 */
    backClick: function () {
      if (this.data.navbarData.taBar) {
        wx.switchTab({
          url: this.data.navbarData.url,
        })
      } else {
        var pages = getCurrentPages();
        if (pages != null && pages.length > 0) {
          var currentpage = pages[pages.length - 1];
          var ModifyData = currentpage.data.ModifyData || false;
          if (pages.length > 1) {
            var pagetop = pages[pages.length - 2];
            pagetop.setData({
              RefreshData: ModifyData
            })
          }
        }
        wx.navigateBack({
          delta: 1,
          fail() {}
        })
      }
    },
    // 返回主页
    homeClick: function () {
      wx.switchTab({
        url: "/pages/home/index",
      })
    }
  }
})