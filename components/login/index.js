// components/loadmore/index.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      //   由父页面传递的数据，变量名字自命名
      type: Boolean,
    },

    userInfo: {
      type: Object,
      observer: function (newVal, oldVal) {
        console.log(newVal, oldVal);
        this.setData({
          newUserInfo: newVal,
        });
      },
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    newUserInfo: {},
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onClose() {
      this.triggerEvent("clone");
    },
    onChooseAvatar(data) {
      console.log(this.data);
      this.setData({
        "newUserInfo.avatarUrl": data.detail.avatarUrl,
      });
    },
    submit() {
      const { avatarUrl, nickname } = this.data.newUserInfo;

      if (!avatarUrl) {
        wx.showToast({
          title: "请点击头像获取微信头像",
          duration: 2000,
        });
      } else if (!nickname || nickname === "微信用户") {
        wx.showToast({
          title: "请输入正确的昵称",
          duration: 2000,
        });
      } else {
        if (avatarUrl === this.data.userInfo.avatarUrl) this.userEdit();
        else this.upload(avatarUrl);
      }
    },
    upload(url, filePath) {
      var _this = this;
      wx.uploadFile({
        url,
        filePath,
        name: "file",
        header: {
          "content-type": "multipart/form-data",
          Authorization: "Bearer " + wx.getStorageSync("authorization"),
        }, // 设置请求的 header
        success: function (res) {
          console.log(res);
          var data = JSON.parse(res.data);
          _this.setData({
            "newUserInfo.avatarUrl": data.detail.avatarUrl,
          });
          _this.userEdit();
        },
        fail: function (res) {
          console.log("res========>", res);
        },
      });
    },
    userEdit() {
      var _this = this;
      _this.onClose();
      _this.triggerEvent("changeInfo", _this.data.newDetail);
      // userEdit(this.data.newDetail, (res) => {
      //   if (res.code === 0) {
      //     _this.onClose();
      //     _this.triggerEvent("changeInfo", _this.data.newDetail);
      //   }
      // });
    },
  },
});
