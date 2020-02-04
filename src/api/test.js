import request from "@/until/server.js";

export default {
  getList() {
    return request({
      method: "get",
      url: "/db.json"
    });
  }
};
