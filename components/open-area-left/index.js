import {
  paysetting,
  iosPayment,
  getmentplanconf,
  appthirdpay,
  androidpaylog,
  payback,
} from "@/api/my";
import { newvideoread, bs } from "@/api/pay";

Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    playerId: {
      type: String,
      value: "",
    },
    srcAppid: {
      type: String,
      value: "",
    },
    dramaId: {
      type: String,
      value: "",
    },
    serialNo: {
      type: Number,
      value: 0,
    },
    extParam: {
      type: String,
      value: "",
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    _isInitChargeDialog: false,
    chargeList: [],
    selectIndex: -1,

    newExtParam: {},
    list: [],
    userInfo: null,
    iosStatus: null,
    uid: wx.getStorageSync("token"),
    showCenter: true,
  },

  /**
   * 组件的方法列表
   */
  methods: {},
});
