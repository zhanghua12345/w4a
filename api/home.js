// 引入 request 文件
import request from "@/utils/request";

// 获取首页数据
export const pageList = (params) => {
  return request({
    url: "/index",
    method: "GET",
    data: params || {},
  });
};

// 获取首页底部或者排行榜
export const moduleList = (params) => {
  return request({
    url: "/getNewModule",
    method: "GET",
    data: params || {},
  });
};

// 获取我的收藏
export const discoverList = (params) => {
  return request({
    url: "/chasingdrama",
    method: "GET",
    data: params || {},
  });
};

// 添加收藏
export const addDiscover = (params) => {
  return request({
    url: "/addkeep",
    method: "POST",
    data: params || {},
  });
};

// 删除收藏
export const deleteDiscover = (params) => {
  return request({
    url: "/chasingdramadel",
    method: "POST",
    data: params || {},
  });
};
