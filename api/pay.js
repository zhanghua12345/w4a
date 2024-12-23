// 引入 request 文件
import request from "@/utils/request";

export const newvideoread = (params) => {
  return request({
    url: "/newvideoread",
    method: "POST",
    data: params || {},
  });
};

export const addkeep = (params) => {
  return request({
    url: "/addkeep",
    method: "POST",
    data: params || {},
  });
};

export const chasingdramadel = (params) => {
  return request({
    url: "/chasingdramadel",
    method: "POST",
    data: params || {},
  });
};

export const bs = (params) => {
  return request({
    url: "/bs",
    method: "POST",
    data: params || {},
  });
};
