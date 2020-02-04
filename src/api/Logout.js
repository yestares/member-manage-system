import request from "@/until/server.js";

export default function logout(token) {
  return request({
    method: "post",
    url: "/user/logout",
    data: {
      token
    }
  });
}
