import request from "@/until/server.js";

export function verification(username, password) {
  return request({
    method: "post",
    url: "/user/login",
    data: {
      username,
      password
    }
  });
}
export function getInfo(token) {
  return request({
    method: "get",
    url: `/user/info/${token}`
  });
}
