<template>
  <div>
    <el-form :inline="true" ref="formName" :model="searchMap">
      <el-form-item prop="user">
        <el-input
          v-model="searchMap.user"
          placeholder="姓名"
          style="width:100px;"
        ></el-input>
      </el-form-item>
      <el-form-item prop="birthday">
        <el-col :span="18">
          <el-date-picker
            style="width:150px;"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            v-model="searchMap.birthday"
          ></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item prop="payType">
        <el-select
          v-model="searchMap.payType"
          style="width:150px;"
          placeholder="支付类型"
        >
          <el-option
            v-for="item in changeType"
            :key="item.type"
            :label="item.name"
            :value="item.type"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="number">
        <el-input
          v-model="searchMap.number"
          style="width:150px;"
          placeholder="手机号"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd">
          <i class="el-icon-plus">新增</i>
        </el-button>
        <el-button @click="resetForm('formName')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="list" size="mini" height="350" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="cardNum" label="身份证号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="birthday" label="出生年月"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column
        prop="integral"
        label="积分"
        width="60"
      ></el-table-column>
      <el-table-column prop="money" label="工资" width="60"></el-table-column>
      <el-table-column prop="payType" label="支付类型">
        <template slot-scope="scope">
          <span>{{ scope.row.payType | payTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <el-dialog title="会员信息" width="30%" :visible.sync="dialogFormVisible">
      <el-form
        class="meber-form"
        :rules="rules"
        ref="ruleForm"
        :model="ruleForm"
      >
        <el-form-item label="姓名" prop="name" :label-width="formLabelWidth">
          <el-input v-model="ruleForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="支付类型"
          prop="payType"
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="ruleForm.payType"
            style="width:150px;"
            placeholder="支付类型"
          >
            <el-option
              v-for="item in changeType"
              :key="item.type"
              :label="item.name"
              :value="item.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="手机号码"
          prop="phone"
          :label-width="formLabelWidth"
        >
          <el-input v-model="ruleForm.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="出身年月"
          prop="birthday"
          :label-width="formLabelWidth"
        >
          <el-col :span="18">
            <el-date-picker
              style="width:150px;"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              v-model="ruleForm.birthday"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item
          label="积分"
          prop="integral"
          :label-width="formLabelWidth"
        >
          <el-input v-model="ruleForm.integral" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="工资" prop="money" :label-width="formLabelWidth">
          <el-input v-model="ruleForm.money" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="身份证号"
          prop="cardNum"
          :label-width="formLabelWidth"
        >
          <el-input v-model="ruleForm.cardNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="住址" prop="address" :label-width="formLabelWidth">
          <el-input
            v-model="ruleForm.address"
            type="textarea"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="ruleForm.id ? upDate('ruleForm') : addClick('ruleForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/MemberList";
const changeType = [
  { type: "1", name: "现金" },
  { type: "2", name: "支付宝" },
  { type: "3", name: "微信" },
  { type: "4", name: "银行卡" }
];
export default {
  created() {
    this.fetchData();
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      searchMap: {
        user: "",
        birthday: "",
        payType: "",
        number: ""
      },
      total: 0,
      list: [],
      changeType,
      dialogFormVisible: false,
      ruleForm: {
        id: null,
        name: "",
        phone: "",
        payType: "",
        birthday: "",
        address: "",
        integral: "",
        money: "",
        cardNum: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入正确的姓名", trigger: "blur" }
        ],
        phone: [{ required: true, message: "手机号不正确", trigger: "blur" }],
        cardNum: [
          { required: true, message: "身份证号不正确", trigger: "blur" }
        ]
      },
      formLabelWidth: "80px"
    };
  },
  methods: {
    addClick(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          api.addMember(this.ruleForm).then(respones => {
            const resp = respones.data;
            if (resp.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
              this.$message({
                message: "新增成功！",
                type: "success"
              });
            } else {
              console.log(resp.message);
              return false;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.ruleForm = {
          name: "",
          phone: "",
          payType: "",
          birthday: "",
          address: "",
          integral: "",
          money: "",
          cardNum: ""
        };
        this.$refs["ruleForm"].resetFields();
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    fetchData() {
      api
        .getList(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const resp = response.data;
          this.total = resp.data.total;
          this.list = resp.data.rows;
        });
    },
    upDate(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          api.editor(this.ruleForm).then(respones => {
            const resp = respones.data;
            if (resp.flag) {
              this.dialogFormVisible = false;
              this.fetchData();
              this.$message({
                message: "修改成功！",
                type: "success"
              });
            } else {
              console.log(resp.message);
              return false;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleEdit(id) {
      api.inquire(id).then(respones => {
        const resp = respones.data;
        this.dialogFormVisible = true;
        this.ruleForm = resp.data;
      });
    },
    handleDelete(id) {
      this.$confirm("确认要删除该会员吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api.deleteMember(id).then(respones => {
            const resp = respones.data;
            if (resp.flag) {
              this.fetchData();
              this.$message({
                message: resp.message,
                type: "success"
              });
            } else {
              console.log(resp.message);
              return false;
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  filters: {
    payTypeFilter(type) {
      const obj = changeType.find(item => item.type === type);
      return obj ? obj.name : null;
    }
  }
};
</script>

<style scoped>
.block {
  padding: 20px;
}
</style>
