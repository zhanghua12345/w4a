// 引入 request 文件
import request from "@/utils/request";
const app = getApp();
// 以下 api 为示例，实际与项目相匹配

// 静态登录获取code
export const login = (params) => {
  return request({
    url: "/reg",
    method: "POST",
    data: params,
  });
};

// 获取用户信息
export const getUser = (params) => {
  return request({
    url: "/user",
    method: "GET",
    data: params || {},
  });
};

// 设置用户信息 nickname/avatar
export const renew = (params) => {
  return request({
    url: "/renew",
    method: "POST",
    data: params || {},
  });
};

// 退出登录，清空token和userInfo
export const logout = (params) => {
  wx.removeStorageSync("token");
  wx.removeStorageSync("userInfo");
  app.globalData.userInfo = "";
};
