import router from "./router";
import { getInfo } from "@/api/login";

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (token) {
    // 获取用户信息
    if (localStorage.getItem("user")) {
      next();
    } else {
      getInfo(token).then(response => {
        const resp = response.data;
        if (resp.flag) {
          localStorage.setItem("user", JSON.stringify(resp.data));
          localStorage.setItem("token", token);
          next();
        } else {
          if (to.path === "/login") {
            next();
          } else {
            next({ path: "/login" });
          }
        }
      });
    }
  } else {
    if (to.path === "/login") {
      next();
    } else {
      next({ path: "/login" });
    }
  }
});
