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
        <el-input v-model="searchMap.name" placeholder="商品名称"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="searchMap.code" placeholder="商品编码"></el-input>
      </el-form-item>
      <el-form-item prop="supplierName">
        <el-input
          readonly
          v-model="searchMap.supplierName"
          @click.native="dialogFormVisible = true"
          placeholder="选择供应商"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd">
          <i class="el-icon-plus">新增</i>
        </el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="goodsList" height="350" border style="width: 100%">
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="name" label="商品名称"></el-table-column>
      <el-table-column prop="code" label="商品编码"></el-table-column>
      <el-table-column prop="spec" label="商品规格"></el-table-column>
      <el-table-column prop="retailPrice" label="零售价"></el-table-column>
      <el-table-column prop="purchasePrice" label="进货价"></el-table-column>
      <el-table-column prop="storageNum" label="库存"></el-table-column>
      <el-table-column prop="supplierName" label="供应商名称"></el-table-column>
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
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <el-dialog title="供应商" :visible.sync="dialogFormVisible">
      <supplier @option-click="currentOption" :isDialog="true"></supplier>
    </el-dialog>

    <!-- 弹出层 -->
    <el-dialog title="商品信息" width="30%" :visible.sync="dialogGoodsVisible">
      <el-form :model="goodsInfo" :rules="rules" ref="popUp">
        <el-form-item
          label="商品名称"
          prop="name"
          :label-width="formLabelWidth"
        >
          <el-input v-model="goodsInfo.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="商品编码"
          prop="code"
          :label-width="formLabelWidth"
        >
          <el-input v-model="goodsInfo.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="商品规格"
          prop="spec"
          :label-width="formLabelWidth"
        >
          <el-input v-model="goodsInfo.spec" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="零售价"
          prop="retailPrice"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="goodsInfo.retailPrice"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="进货价"
          prop="purchasePrice"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="goodsInfo.purchasePrice"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="库存"
          prop="storageNum"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="goodsInfo.storageNum"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="供应商名称"
          :label-width="formLabelWidth"
          prop="supplierName"
        >
          <el-input
            readonly
            v-model="goodsInfo.supplierName"
            @click.native="editorSupplier"
            placeholder="选择供应商"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogGoodsVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd('popUp')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/goods";
import Supplier from "@/views/Main/Supplier.vue";
export default {
  components: { Supplier },
  created() {
    this.fetchData();
  },
  data() {
    return {
      goodsList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      searchMap: {
        id: null,
        name: "",
        code: "",
        supplierName: ""
      },
      dialogFormVisible: false,
      dialogGoodsVisible: false,
      formLabelWidth: "100px",
      goodsInfo: {
        id: null,
        name: "",
        code: "",
        spec: "",
        retailPrice: "",
        purchasePrice: "",
        storageNum: "",
        supplierName: "",
        supplierId: ""
      },
      isEditor: false,
      rules: {
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入商品编号", trigger: "blur" }],
        spec: [{ required: true, message: "请输入商品规格", trigger: "blur" }],
        retailPrice: [
          { required: true, message: "请输入零售价", trigger: "blur" }
        ],
        purchasePrice: [
          { required: true, message: "请输入进货价", trigger: "blur" }
        ],
        storageNum: [
          { required: true, message: "请输入库存", trigger: "blur" }
        ],
        supplierName: [
          { required: true, message: "请选择供应商", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    fetchData() {
      api
        .getList(this.currentPage, this.pageSize, this.searchMap)
        .then(repsones => {
          const resp = repsones.data;
          if (resp.flag) {
            this.total = resp.data.total;
            this.goodsList = resp.data.rows;
          } else {
            console.log(resp.message);
            return false;
          }
        });
    },
    handleEdit(id) {
      this.dialogGoodsVisible = true;
      api.reflowEditor(id).then(respones => {
        const resp = respones.data;
        if (resp.flag) {
          this.goodsInfo = resp.data;
        } else {
          console.log(resp.message);
          return false;
        }
      });
    },
    submitEditorInfo() {
      api.submitEditor(this.goodsInfo).then(respones => {
        const resp = respones.data;
        if (resp.flag) {
          this.dialogGoodsVisible = false;
          this.isEditor = false;
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
    },
    handleDelete(id) {
      this.$confirm("确认删除该商品吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api.deleteGoods(id).then(respones => {
            const resp = respones.data;
            if (resp.flag) {
              this.fetchData();
              this.$message({
                type: "success",
                message: "删除成功!"
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
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    currentOption(val) {
      console.log(val);
      if (this.isEditor) {
        this.goodsInfo.supplierId = val.id;
        this.goodsInfo.supplierName = val.name;
      } else {
        this.searchMap.supplierName = val.name;
      }
      this.dialogFormVisible = false;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleAdd() {
      this.dialogGoodsVisible = true;
      this.$nextTick(() => {
        this.$refs["popUp"].resetFields();
      });
    },
    submitAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          api.addGoods(this.goodsInfo).then(respones => {
            const resp = respones.data;
            if (resp.flag) {
              this.dialogGoodsVisible = false;
              this.isEditor = false;
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
          console.log("error submit!!");
          return false;
        }
      });
    },
    editorSupplier() {
      this.dialogFormVisible = true;
      this.isEditor = true;
    }
  }
};
</script>

<style scoped>
.block {
  padding: 10px;
}
</style>
