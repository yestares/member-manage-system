<template>
  <div class="wrapper">
    <div class="login">
      <h2 class="title">会员管理系统</h2>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >登录</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { verification, getInfo } from "@/api/login";
export default {
  data() {
    return {
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "账号不能为空！", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空！", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          verification(this.ruleForm.username, this.ruleForm.password).then(
            resp => {
              this.$message({
                message: "登录成功！",
                type: "success"
              });
              const response = resp.data;
              if (response.flag) {
                getInfo(response.data.token).then(resp => {
                  const respUser = resp.data;
                  if (respUser.flag) {
                    // 获取成功
                    localStorage.setItem("user", JSON.stringify(respUser.data));
                    localStorage.setItem("token", response.data.token);
                    this.$router.push("/");
                  } else {
                    // 获取失败
                    this.$message({
                      message: respUser.message,
                      type: "warning"
                    });
                  }
                });
              } else {
                // 登录失败
                this.$message({
                  message: response.message,
                  type: "warning"
                });
              }
            }
          );
        } else {
          this.$message.error("请输入账号或密码");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style>
body {
  margin: 0;
}
.wrapper {
  position: absolute;
  background: url("../assets/login.jpg");
  height: 100%;
  width: 100%;
}
.title {
  text-align: center;
}
.wrapper .login {
  width: 300px;
  margin: 150px auto;
  background-color: rgba(250, 250, 250, 0.8);
  padding: 30px 30px 10px 10px;
  border-radius: 10px;
}
.el-form-item__label {
  color: #606266;
}
</style>
