<template>
  <div class="navbar">
    <el-menu
      :router="true"
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-menu-item index="/home">
        <i class="el-icon-house"></i>
        <span slot="title">首页</span>
      </el-menu-item>

      <el-menu-item index="/member/">
        <i class="el-icon-medal"></i>
        <span slot="title">会员管理</span>
      </el-menu-item>

      <el-menu-item index="/supplier/">
        <i class="el-icon-sell"></i>
        <span slot="title">供应商管理</span>
      </el-menu-item>

      <el-menu-item index="/goods/">
        <i class="el-icon-shopping-cart-full"></i>
        <span slot="title">商品管理</span>
      </el-menu-item>

      <el-menu-item index="/staff/">
        <i class="el-icon-user-solid"></i>
        <span slot="title">员工管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {};
</script>

<style>
.el-menu {
  border-right: none;
}
</style>
