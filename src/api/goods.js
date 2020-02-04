import request from "@/until/server.js";

export default {
  getList(page, size, searchMap) {
    return request({
      url: `/goods/list/search/${page}/${size}`,
      method: "post",
      data: searchMap
    });
  },
  addGoods(info) {
    return request({
      url: "/goods",
      method: "post",
      data: info
    });
  },
  reflowEditor(id) {
    return request({
      url: `/goods/${id}`,
      method: "post"
    });
  },
  submitEditor(obj) {
    return request({
      url: "/goods/editor",
      method: "put",
      data: obj
    });
  },
  deleteGoods(id) {
    return request({
      url: `/goods/delete/${id}`,
      method: "delete"
    });
  }
};
