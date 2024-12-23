// components/loadmore/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    status: {
      //   由父页面传递的数据，变量名字自命名
      type: String,
    },
    loadingText: {
      type: String,
      value: "努力加载中",
    },
    loadmoreText: {
      type: String,
      value: "轻轻上拉",
    },
    nomoreText: {
      type: String,
      value: "没有更多了",
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {},
});
