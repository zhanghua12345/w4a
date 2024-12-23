// 引入 request 文件
import request from "@/utils/request";

// 获取首页数据
export const historyList = (params) => {
  return request({
    url: "/history",
    method: "GET",
    data: params || {},
  });
};

// 获取赠币明细
export const givelist = (params) => {
  return request({
    url: "/getgivelist",
    method: "GET",
    data: params || {},
  });
};

// 消费明细
export const moneyLogList = (params) => {
  return request({
    url: "/moneylog",
    method: "GET",
    data: params || {},
  });
};

// 充值明细
export const rechargeList = (params) => {
  return request({
    url: "/rechargerecord",
    method: "GET",
    data: params || {},
  });
};

// 获取客服图片
export const getkefu = (params) => {
  return request({
    url: "/getkefu",
    method: "GET",
    data: params || {},
  });
};

// 支付数据接口
export const paysetting = (params) => {
  return request({
    url: "/paysetting",
    method: "GET",
    data: params || {},
  });
};

// 判断是不是IOS
export const iosPayment = (params) => {
  return request({
    url: "/iosPayment",
    method: "GET",
    data: params || {},
  });
};

// 获取安卓支付config
export const getmentplanconf = (params) => {
  return request({
    url: "/getmentplanconf",
    method: "GET",
    data: params || {},
  });
};

// 获取支付的key
export const appthirdpay = (params) => {
  return request({
    url: "/appthirdpay",
    method: "POST",
    data: params || {},
  });
};

// 获取支付的key
export const androidpaylog = (params) => {
  return request({
    url: "/androidpaylog",
    method: "POST",
    data: params || {},
  });
};

// 获取支付活动数据
export const payback = (params) => {
  return request({
    url: "/payback",
    method: "get",
    data: params || {},
  });
};
