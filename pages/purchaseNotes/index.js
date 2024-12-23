// index.js

Page({
  data: {
    activeNames: ["1", "2", "3", "4"],
  },
  onLoad() {},
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
});
