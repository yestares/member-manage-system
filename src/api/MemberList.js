import request from "@/until/server.js";

export default {
  getList(page, size, searchMap) {
    return request({
      url: `/member/list/search/${page}/${size}`,
      method: "post",
      data: searchMap
    });
  },
  addMember(addMap) {
    return request({
      url: "/member",
      method: "post",
      data: addMap
    });
  },
  inquire(id) {
    return request({
      url: `/member/${id}`,
      method: "post"
    });
  },
  editor(obj) {
    return request({
      url: "/member/editor",
      method: "put",
      data: obj
    });
  },
  deleteMember(id) {
    return request({
      method: "delete",
      url: `/member/delete/${id}`
    });
  }
};
