import request from "@/until/server.js";

export default {
  search(page, size, searchMap) {
    return request({
      url: `/staff/list/search/${page}/${size}`,
      method: "post",
      data: searchMap
    });
  },

  add(pojo) {
    return request({
      url: "/staff",
      method: "post",
      data: pojo
    });
  },

  getById(id) {
    return request({
      url: `/staff/${id}`,
      method: "get"
    });
  },
  // 更新操作
  update(pojo) {
    return request({
      url: `/staff/editor`,
      method: "put",
      data: pojo
    });
  },

  deleteById(id) {
    return request({
      url: `/staff/delete/${id}`,
      method: "delete"
    });
  }
};
