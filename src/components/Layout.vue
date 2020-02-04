<template>
  <div>
    <app-header></app-header>
    <nav-bar></nav-bar>
    <app-main></app-main>
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader";
import AppMain from "@/components/AppMain";
import NavBar from "@/components/NavBar";
export default {
  components: {
    AppHeader,
    AppMain,
    NavBar
  }
};
</script>

<style>
/* 头部区域 */
.header {
  position: absolute;
  line-height: 50px;
  top: 0px;
  left: 0px;
  right: 0px;
  background-color: #2d3a4b;
}
.navbar {
  position: absolute;
  width: 230px;
  top: 50px;
  left: 0px;
  bottom: 0px;
  overflow-y: auto;
  background-color: #545c64;
}
.main {
  position: absolute;
  top: 50px;
  left: 230px;
  right: 0px;
  bottom: 0px;
  padding: 10px;
  overflow-y: auto;
  /* background-color: red; */
}
</style>
