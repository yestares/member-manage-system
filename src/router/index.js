import Vue from "vue";
import VueRouter from "vue-router";
import Login from "@/views/Login.vue";
import Home from "@/views/Home.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/",
    component: Home,
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "home",
        meta: {
          title: "首页"
        },
        component: () => import("@/views/Main/AppHome.vue")
      }
    ]
  },
  {
    path: "/member",
    component: Home,
    children: [
      {
        path: "/",
        meta: {
          title: "会员管理"
        },
        component: () => import("@/views/Main/Member.vue")
      }
    ]
  },
  {
    path: "/staff",
    component: Home,
    children: [
      {
        path: "/",
        meta: {
          title: "员工管理"
        },
        component: () => import("@/views/Main/Staff.vue")
      }
    ]
  },
  {
    path: "/goods",
    component: Home,
    children: [
      {
        path: "/",
        meta: {
          title: "商品管理"
        },
        component: () => import("@/views/Main/Goods.vue")
      }
    ]
  },
  {
    path: "/supplier",
    component: Home,
    children: [
      {
        path: "/",
        meta: {
          title: "供应商管理"
        },
        component: () => import("@/views/Main/Supplier.vue")
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
