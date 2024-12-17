// components/recentlyPlayed/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {},
    },
    show: {
      type: Boolean,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    onClose() {
      this.triggerEvent("clone");
    },
  },
});
