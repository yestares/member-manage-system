<template>
  <div class="header">
    <router-link tag="span" to="/home">
      <i class="el-icon-s-custom logo"></i>
      <span class="company">会员管理系统</span>
    </router-link>
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        <span>{{ userName }}</span>
        <i class="el-icon-caret-bottom"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="changPass" icon="el-icon-edit">修改密码</el-dropdown-item>
        <el-dropdown-item command="logout" icon="el-icon-switch-button">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-dialog title="修改密码" width="30%" :visible.sync="dialogFormVisible">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="原密码" prop="oldPass">
          <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitPwd('ruleForm')">提交</el-button>
          <el-button @click="$refs['ruleForm'].resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import logoutApi from "@/api/Logout";
import changPassApi from "@/api/changePwd";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        const uesrId = localStorage.getItem("user").id;
        changPassApi.oldVerify(uesrId, this.ruleForm.oldPass).then(response => {
          const resp = response.data;
          if (resp.flag) {
            callback();
          } else {
            callback(new Error("密码错误！请重新输入"));
            console.log(resp.message);
            return false;
          }
        });
      }
    };

    var validatePass1 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码！"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码！"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      userName:'',
      dialogFormVisible: false,
      ruleForm: {
        oldPass: "",
        pass: "",
        checkPass: ""
      },
      rules: {
        oldPass: [{ validator: validatePass, trigger: "blur" }],
        pass: [{ validator: validatePass1, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "change" }]
      }
    };
  },
  mounted(){
    this.userName = JSON.parse(localStorage.getItem("user")).name
  },
  methods: {
    submitPwd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const userId = localStorage.getItem("user").id;
          changPassApi.newPwdSub(userId, this.ruleForm.pass).then(response => {
            const resp = response.data;
            if (resp.flag) {
              this.$message({
                message: resp.message,
                type: "success"
              });
              this.dialogFormVisible = false;
              this.logoutSystem();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleCommand(command) {
      if (command === "changPass") {
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["ruleForm"].resetFields();
        });
      } else if (command === "logout") {
        this.logoutSystem();
      }
    },
    logoutSystem() {
      logoutApi(localStorage.getItem("token")).then(response => {
        const resp = response.data;
        if (resp.flag) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          this.$router.push("/login");
          this.$message("退出成功");
        } else {
          console.log(resp.message);
          return false;
        }
      });
    }
  }
};
</script>

<style>
.logo {
  vertical-align: middle;
  padding: 0px 10px 0 40px;
  color: #fff;
  font-size: 30px;
  cursor: pointer;
}
.company {
  position: absolute;
  color: white;
  cursor: pointer;
}

/* 下拉菜单  */

.el-dropdown-link {
  cursor: pointer;
  color: #fff;
}
.el-dropdown {
  position: absolute;
  right: 0;
  margin-right: 30px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
