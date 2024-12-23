// index.js
import { getkefu } from "@/api/my";
import { addDiscover, deleteDiscover } from "@/api/home";
Page({
  data: {
    kfImg: "",
  },

  async onLoad() {
    const res = await getkefu();
    console.log(res);
    this.setData({
      kfImg: res.wxkf,
    });
  },
});
