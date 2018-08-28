<template>
  <div class="um" id="um">
    <div class="toolbar"></div>
    <el-table :data="tabledata" border size="mini" stripe highlight-current-row :height='appheight-140'>
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column prop="realname" label="姓名" align="center" :width="80"></el-table-column>
      <el-table-column prop="username" label="账号" align="center" :width="100"></el-table-column>
      <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
      <el-table-column prop="mobile" label="电话" align="center"></el-table-column>
      <el-table-column prop="wxid" label="微信ID" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" align="center" :width="100"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="del(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import request from "@/util/request";
import { mapGetters } from "vuex";
export default {
  name: "usermanager",
  data() {
    return {
      tabledata: []
    };
  },
  computed: {
    ...mapGetters(["appheight"])
  },
  mounted() {
    this.getdata();
  },
  methods: {
    getdata() {
      request.get("/api/user/getUsers").then(r => {
        this.tabledata = r;
      });
    },
    update(row) {},
    del(row) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          request.get('/api/user/delUser',row).then(r=>{
            if(+r){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.tabledata.splice(index, 1);
            }else{
              this.$message({
                type: 'error',
                message: '删除失败请联系管理员!'
              });
            }
          });
      }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
      });
    }
  }
};
</script>
<style scoped>
#um {
  padding: 10px;
}
.toolbar {
  min-height: 60px;
  background: #f1ffef;
  margin-bottom: 10px;
  border-radius: 0 0 5px 5px;
}
</style>
