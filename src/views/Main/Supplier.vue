<template>
  <div>
    <!-- 搜索表单 -->
    <el-form
      :inline="true"
      ref="searchForm"
      :model="searchMap"
      class="demo-form-inline"
    >
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="供应商名称"></el-input>
      </el-form-item>
      <el-form-item v-if="!isDialog" prop="linkman">
        <el-input v-model="searchMap.linkman" placeholder="联系人"></el-input>
      </el-form-item>
      <el-form-item v-if="!isDialog" prop="mobile">
        <el-input v-model="searchMap.mobile" placeholder="联系电话"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button v-if="!isDialog" type="primary" @click="handleAdd">
          <i class="el-icon-plus">新增</i>
        </el-button>
        <el-button v-if="!isDialog" @click="resetForm('searchForm')"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table
      :highlight-current-row="isDialog"
      @current-change="clickCurrentChange"
      :data="tableList"
      height="350"
      border
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="name" label="供应商名称"></el-table-column>
      <el-table-column prop="linkman" label="联系人"></el-table-column>
      <el-table-column
        v-if="!isDialog"
        prop="mobile"
        label="联系电话"
      ></el-table-column>
      <el-table-column
        v-if="!isDialog"
        prop="remark"
        label="备注"
        width="300"
      ></el-table-column>
      <el-table-column v-if="!isDialog" label="操作">
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
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[15, 20]"
        :page-size="pageSize"
        :layout="
          !isDialog
            ? 'total, sizes, prev, pager, next, jumper'
            : 'prev, pager, next'
        "
        :total="total"
      ></el-pagination>
    </div>
    <!-- 弹出层 -->
    <el-dialog title="供应商信息" width="30%" :visible.sync="dialogFormVisible">
      <el-form :model="popUpForm" :rules="rules" ref="popUp">
        <el-form-item
          label="供应商名称"
          prop="name"
          :label-width="formLabelWidth"
        >
          <el-input v-model="popUpForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="联系人"
          prop="linkman"
          :label-width="formLabelWidth"
        >
          <el-input v-model="popUpForm.linkman" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile" :label-width="formLabelWidth">
          <el-input v-model="popUpForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="popUpForm.id ? modify('popUp') : submit('popUp')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/supplier";
export default {
  props: {
    isDialog: Boolean
  },
  mounted() {
    this.fetchData();
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 15,
      total: 0,
      searchMap: {
        name: "",
        linkman: "",
        mobile: ""
      },
      tableList: [],
      dialogFormVisible: false,
      formLabelWidth: "100px",
      popUpForm: {
        id: null,
        name: "",
        linkman: "",
        mobile: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入供应商名称", trigger: "blur" }
        ],
        linkman: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        mobile: [{ required: true, message: "电话格式不对", trigger: "blur" }]
      }
    };
  },
  methods: {
    fetchData() {
      api
        .getList(this.currentPage, this.pageSize, this.searchMap)
        .then(respones => {
          const resp = respones.data;
          if (resp.flag) {
            this.tableList = resp.data.rows;
            this.total = resp.data.total;
          } else {
            console.log(resp.message);
            return false;
          }
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleEdit(id) {
      this.dialogFormVisible = true;
      api.searchEditor(id).then(respones => {
        const resp = respones.data;
        if (resp.flag) {
          this.popUpForm = resp.data;
        } else {
          console.log(resp.message);
          return false;
        }
      });
    },
    modify(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          api.upDate(this.popUpForm).then(respones => {
            const resp = respones.data;
            if (resp.flag) {
              this.dialogFormVisible = false;
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
        } else {
          console.log("提交失败！");
          return false;
        }
      });
    },
    handleDelete(id) {
      this.$confirm("此操作将永久删除该供应商, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api.deleteSupplier(id).then(respones => {
            const resp = respones.data;
            if (resp.flag) {
              this.$message({
                message: resp.message,
                type: "success"
              });
              this.fetchData();
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
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          api.addSupplier(this.popUpForm).then(respones => {
            const resp = respones.data;
            if (resp.flag) {
              this.dialogFormVisible = false;
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
        } else {
          console.log("提交失败！");
          return false;
        }
      });
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["popUp"].resetFields();
      });
    },
    clickCurrentChange(val) {
      this.$emit("option-click", val);
    }
  }
};
</script>

<style scoped>
.block {
  padding: 10px;
}
</style>
