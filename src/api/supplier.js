import request from "@/until/server.js";

export default {
  getList(page, size, searchMap) {
    return request({
      url: `/supplier/list/search/${page}/${size}`,
      method: "post",
      data: searchMap
    });
  },
  addSupplier(info) {
    return request({
      url: "/supplier",
      method: "post",
      data: info
    });
  },
  searchEditor(id) {
    return request({
      url: `/supplier/${id}`,
      method: "post"
    });
  },
  upDate(obj) {
    return request({
      url: "/supplier/editor",
      method: "put",
      data: obj
    });
  },
  deleteSupplier(id) {
    return request({
      url: `/supplier/delete/${id}`,
      method: "delete"
    });
  }
};
