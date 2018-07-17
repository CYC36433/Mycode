<template>
    <el-scrollbar id="scrollcontainer">
        <div style="padding:20px;" id='apimanager'>
            <el-card class='card' id="card">
                <div slot="header" class="clearfix">
                    <span style="font-weight:bold">接口分类</span>
                    <el-button style="float: right; padding: 3px 0" type="text" @click="addCategory">添加</el-button>
                </div>
                <div style="margin:-20px;">
                    <div v-for="(o, index) in category" :key="o.categoryid" class="item" :class="{'selected':currentCategory.categoryid === o.categoryid}" @click="currentCategory = o">
                        <span>{{o.categoryname }}({{o.cnt}})</span>
                        <span class="categoryTool" v-if="o.categoryid>0 && o.categoryid<9999">
                            <i class="el-icon-edit" title="修改" @click="updateCategory(o.categoryid,o.categoryname,index)"></i>
                            <i v-if="!o.cnt" class="el-icon-delete" title="删除" @click="delCategory(o.categoryid,index)"></i>
                        </span>
                    </div>
                </div>
            </el-card>
            <div class="apicontainer">
                <div style='margin-bottom:16px;font-size:16px;font-weight:bold;'>{{currentCategory.categoryname}}({{currentCategory.cnt}})
                    <span class="newapi">开发新接口：
                        <span @click="openSqlDialog('add')">SQL</span>
                        <span>|</span>
                        <span>nodejs</span>
                    </span>
                </div>
                <div v-for="route in apilist" v-if="isshow(route)" class="apidoc" :class="apitheme(route)">
                    <div class="apihead" @click="headclick(route)">
                        <span class="route">{{route}}</span>
                        <i class="el-icon-arrow-right right"></i>
                        <span class="apiname right" v-if="apidocs[route]">{{apidocs[route].name}}</span>
                    </div>
                    <el-collapse-transition>
                        <div class="doc" v-if="apidocs[route] && route === activeRoute">
                            <div v-if="route.indexOf('/api/sql/')>-1" class="sqldev" @click="openSqlDialog('update')">SQL开发</div>
                            <div class='doctitle'>基本信息：
                                <span class="tools">
                                    <span v-if="!docModel.remarkEdit" @click="docModel.remarkEdit=true">编辑</span>
                                    <span v-if="docModel.remarkEdit" @click="cancleRemarkEdit">取消</span>
                                    <span v-if="docModel.remarkEdit" @click="saveRemark">保存</span>
                                </span>
                            </div>
                            <div class="content">
                                <p v-if="!docModel.remarkEdit">{{'功能描述：'+apidocs[route].remark}}</p>
                                <template v-else>
                                    <label class="doctitle2">接口名称：</label>
                                    <el-input ref="apiname" :value="apidocs[route].name" size="small"></el-input>
                                    <label class="doctitle2" style="margin-top:10px;">接口分类：</label>
                                    <el-select ref="category" v-model="temp_categoryid" placeholder="请选择">
                                        <el-option v-for="item in category" v-if="!(item.categoryid===0 || item.categoryid===9999)" :key="item.categoryid" :label="item.categoryname" :value="item.categoryid"></el-option>
                                    </el-select>
                                    <label class="doctitle2" style="margin-top:10px;">功能描述：</label>
                                    <el-input ref="remark" autosize :value="apidocs[route].remark" size="small" type="textarea" :autosize="{ minRows: 4}"></el-input>
                                </template>
                            </div>
                            <div class='doctitle'>参数说明：
                                <span class="tools">
                                    <span v-if="!docModel.paramsEdit" @click="docModel.paramsEdit=true">编辑</span>
                                    <span v-if="docModel.paramsEdit" @click="docModel.paramsEdit=false">取消</span>
                                    <span v-if="docModel.paramsEdit" @click="saveParams">保存</span>
                                </span>
                            </div>
                            <div class="content">
                                <el-table v-if="!docModel.paramsEdit" :data="JSON.parse(apidocs[route].params)" border size='mini'>
                                    <el-table-column type="index" width="50" align="center"></el-table-column>
                                    <el-table-column prop="param" label="参数" align="center"></el-table-column>
                                    <el-table-column prop="name" label="名称" align="center"></el-table-column>
                                    <el-table-column prop="sample" label="取值示例" align="center"></el-table-column>
                                    <el-table-column prop="remark" label="说明" align="center"></el-table-column>
                                </el-table>
                                <template v-else>
                                    <label class="doctitle2" style="margin-top:10px;">注：一个参数信息占一行，格式为 参数名-中文名称-取值示例-参数说明，不要乱用符号“-”</label>
                                    <el-input ref="params" autosize :value="paramLines" size="small" type="textarea" :autosize="{ minRows: 4}"></el-input>
                                </template>
                            </div>
                            <div class='doctitle'>返回结果说明：
                                <span class="tools">
                                    <span v-if="!docModel.responseEdit" @click="docModel.responseEdit=true">编辑</span>
                                    <span v-if="docModel.responseEdit" @click="docModel.responseEdit=false">取消</span>
                                    <span v-if="docModel.responseEdit" @click="saveResponse">保存</span>
                                </span>
                            </div>
                            <div class="content">
                                <el-table v-if="!docModel.responseEdit" :data="JSON.parse(apidocs[route].responsedict)" border size='mini'>
                                    <el-table-column type="index" width="50" align="center"></el-table-column>
                                    <el-table-column prop="field" label="字段" align="center"></el-table-column>
                                    <el-table-column prop="name" label="名称" align="center"></el-table-column>
                                    <el-table-column prop="remark" label="说明" align="center"></el-table-column>
                                </el-table>
                                <template v-else>
                                    <label class="doctitle2" style="margin-top:10px;">注：一个参数信息占一行，格式为 字段-中文名称-备注说明，不要乱用符号“-”</label>
                                    <el-input ref="response" autosize :value="responseLines" size="small" type="textarea" :autosize="{ minRows: 4}"></el-input>
                                </template>
                            </div>
                            <div class='doctitle'>测试：</div>
                            <div class="content">
                                <el-input autosize :value="JSON.stringify(testParams,null,2)" size="small" type="textarea" style="margin-bottom:-1px;"></el-input>
                                <el-input :value="testurl" readonly size="small">
                                    <template slot="prepend">
                                        接口地址
                                    </template>
                                <el-button slot="append" icon="el-icon-search" @click="test">执行</el-button>
                            </el-input>
                            <pre class="testresult" v-if="testresult">{{JSON.stringify(testresult,null,2)}}</pre>
                        </div>
                    </div>
                    <div class="doc" v-if="!apidocs[route] && route === activeRoute" style="text-align:center;">
                        <span style="cursor:pointer;color:blue;" @click="addApidoc">创建文档</span>
                    </div>
                </el-collapse-transition>
            </div>
        </div>
        <addsqlapi :show.sync="showaddsqlapi" :mode="sqlapimode" :methodname="methodname" title="SQL接口开发" @addsqlapi="added" @updatesqlapi="updated"></addsqlapi>
    </div>
</el-scrollbar>
</template>
<script>
import request from "@/util/request";
import SYSCONFIG from "../../../static/config";
import addsqlapi from "./addsqlapi";
export default {
  name: "apimanager",
  data() {
    return {
      category: [],
      currentCategory: {},
      apilist: [],
      apidocs: {},
      activeRoute: null,
      testresult: null,
      docModel: {
        remarkEdit: false,
        paramsEdit: false,
        responseEdit: false
      },
      temp_categoryid: null,
      showaddsqlapi: false,
      sqlapimode: "add", //add or update
      methodname:""
    };
  },
  computed: {
    testurl() {
      return SYSCONFIG.host + this.activeRoute;
    },
    testParams() {
      let p = {};
      let api = this.apidocs[this.activeRoute];
      if (api && api.params) {
        JSON.parse(api.params).forEach(o => {
          p[o.param] = o.sample;
        });
      }
      return p;
    },
    paramLines() {
      if (this.activeRoute == null) return "";
      let ps_str = this.apidocs[this.activeRoute].params;
      if (ps_str) {
        let str = "";
        let ps = JSON.parse(ps_str);
        ps.forEach(o => {
          str +=
            "\n" + o.param + "-" + o.name + "-" + o.sample + "-" + o.remark;
        });
        return str.substring(1);
      } else {
        return "";
      }
    },
    responseLines() {
      if (this.activeRoute == null) return "";
      let r_str = this.apidocs[this.activeRoute].responsedict;
      if (r_str) {
        let str = "";
        let ps = JSON.parse(r_str);
        ps.forEach(o => {
          str += "\n" + o.field + "-" + o.name + "-" + o.remark;
        });
        return str.substring(1);
      } else {
        return "";
      }
    }
  },
  watch: {
    activeRoute() {
      this.testresult = null;
      this.temp_categoryid = this.apidocs[this.activeRoute]
        ? this.apidocs[this.activeRoute].categoryid
        : null;
    }
  },
  components: {
    addsqlapi
  },
  mounted() {
    request.all([this.getCategory(), this.getApiList()]).then(
      request.spread((r1, r2) => {
        //开始统计
        var hash = {
          0: this.apilist.length,
          9999: 0
        };
        this.apilist.forEach(o => {
          let api = this.apidocs[o];
          if (!api || !api.categoryid) hash[9999]++;
          else if (hash[api.categoryid]) hash[api.categoryid]++;
          else hash[api.categoryid] = 1;
        });
        r1.forEach((o, i) => {
          o.cnt = hash[o.categoryid] ? hash[o.categoryid] : 0;
        });
        this.category = r1;
        this.currentCategory = r1[0];
      })
    );
  },
  methods: {
    openSqlDialog(mode) {
      this.sqlapimode = mode;
      this.showaddsqlapi = true;
      if (mode == "update") {
        this.methodname = this.activeRoute.split('/').reverse()[0]
      }
    },
    apitheme(route) {
      return {
        red: route.indexOf("/del") > -1,
        blue: route.indexOf("/add") > -1,
        yellow: route.indexOf("/update") > -1
      };
    },
    cancleRemarkEdit() {
      this.docModel.remarkEdit = false;
      this.temp_categoryid = this.apidocs[this.activeRoute].categoryid;
    },
    headclick(route) {
      this.activeRoute = this.activeRoute == route ? null : route;
    },
    isshow(route) {
      if (this.currentCategory.categoryid === 0) return true;
      if (
        this.apidocs[route] &&
        this.apidocs[route].categoryid === this.currentCategory.categoryid
      )
        return true;
      if (
        this.currentCategory.categoryid === 9999 &&
        (!this.apidocs[route] || this.apidocs[route].categoryid == null)
      )
        return true;
    },
    getApiList() {
      let q1 = request.get("/devapi/manapi/getSqlApiList");
      let q2 = request.get("/devapi/manapi/getFileApiRouteList");
      let q3 = request.get("/devapi/manapi/getApidocList");
      return request.all([q1, q2, q3]).then(
        request.spread((r1, r2, r3) => {
          let r = r1.concat(r2);
          this.apilist = r;
          r3.forEach(o => {
            this.apidocs[o.route] = o;
          });
        })
      );
    },
    getCategory() {
      return request.get("/devapi/manapi/getApiCategoryList").then(r => {
        let arr = [
          {
            categoryid: 0,
            categoryname: "全部接口"
          }
        ];
        arr = arr.concat(r);
        arr.push({
          categoryid: 9999,
          categoryname: "未分类接口"
        });
        return arr;
      });
    },
    addCategory() {
      this.$prompt("请输入分类名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S/,
        inputErrorMessage: "名称不能为空"
      }).then(({ value }) => {
        request
          .get("/devapi/manapi/addApiCategory", {
            name: value
          })
          .then(r => {
            this.$message({
              type: "success",
              message: "新增接口分类成功，分类ID是" + r
            });
            r.cnt = 0;
            this.category.splice(-1, 0, r);
          });
      });
    },
    updateCategory(id, name, index) {
      this.$prompt("请输入分类名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S/,
        inputValue: name,
        inputErrorMessage: "名称不能为空"
      }).then(({ value }) => {
        request
          .get("/devapi/manapi/updateCategory", {
            id: id,
            name: value
          })
          .then(r => {
            this.$message({
              type: "success",
              message: "修改接口分类成功"
            });
            this.currentCategory.categoryname = value;
            this.$set(this.category, index, this.currentCategory);
          });
      });
    },
    delCategory(id, index) {
      request
        .get("/devapi/manapi/delApiCategory", {
          id: id
        })
        .then(r => {
          this.$message({
            type: "success",
            message: "删除接口分类成功"
          });
          this.category.splice(index, 1);
          this.currentCategory = this.category[0];
        });
    },
    test() {
      request.get(this.activeRoute, this.testParams).then(r => {
        this.testresult = r;
      });
    },
    saveRemark() {
      var p = {
        id: this.apidocs[this.activeRoute].docid,
        remark: this.$refs.remark[0].currentValue,
        name: this.$refs.apiname[0].currentValue,
        categoryid: this.temp_categoryid
      };
      request.get("/devapi/manapi/updateApidocRemark", p).then(r => {
        this.$message({
          type: "success",
          message: "修改接口信息成功"
        });
        this.docModel.remarkEdit = false;
        let api = this.apidocs[this.activeRoute];
        var category_ischange = api.categoryid != this.temp_categoryid;
        if (category_ischange) {
          let oldc = this.category.find((o, i) => {
            let targetid = api.categoryid == null ? 9999 : api.categoryid;
            if (o.categoryid == targetid) {
              o.cnt--;
              this.$set(this.category, i, o);
              return true;
            }
          });
          let newc = this.category.find((o, i) => {
            if (o.categoryid == this.temp_categoryid) {
              o.cnt++;
              this.$set(this.category, i, o);
              return true;
            }
          });
        }
        api.remark = p.remark;
        api.name = p.name;
        api.categoryid = p.categoryid;
      });
    },
    saveParams() {
      let strline = this.$refs.params[0].currentValue;
      let arr = strline.trim().split("\n");
      let ps = [];
      arr.forEach(line => {
        if (line.trim().length) {
          let lineArr = line.trim().split("-");
          ps.push({
            param: lineArr[0],
            name: lineArr[1],
            sample: lineArr[2],
            remark: lineArr[3]
          });
        }
      });
      let p = {
        id: this.apidocs[this.activeRoute].docid,
        params: JSON.stringify(ps)
      };
      request.post("/devapi/manapi/updateApidocParams", p).then(r => {
        this.$message({
          type: "success",
          message: "修改接口参数成功"
        });
        this.docModel.paramsEdit = false;
        this.apidocs[this.activeRoute].params = p.params;
      });
    },
    saveResponse() {
      let strline = this.$refs.response[0].currentValue;
      let arr = strline.trim().split("\n");
      let ps = [];
      arr.forEach(line => {
        if (line.trim().length) {
          let lineArr = line.trim().split("-");
          ps.push({
            field: lineArr[0],
            name: lineArr[1],
            remark: lineArr[2]
          });
        }
      });
      let p = {
        id: this.apidocs[this.activeRoute].docid,
        responsedict: JSON.stringify(ps)
      };
      request.post("/devapi/manapi/updateApidocResponsedict", p).then(r => {
        this.$message({
          type: "success",
          message: "修改接口结果说明成功"
        });
        this.docModel.responseEdit = false;
        this.apidocs[this.activeRoute].responsedict = p.responsedict;
      });
    },
    addApidoc() {
      request
        .get("/devapi/manapi/addApidoc", {
          route: this.activeRoute
        })
        .then(r => {
          this.apidocs[this.activeRoute] = r;
          let temp = this.activeRoute;
          this.activeRoute = null;
          this.activeRoute = temp;
          this.$message({
            type: "success",
            message: "创建文档成功"
          });
        });
    },
    added(doc) {
      this.apilist.push(doc.route);
      let c = this.category[0];
      c.cnt++;
      this.category.splice(0, 1, c);
      c = this.category.find(o => {
        return o.categoryid == 9999;
      });
      let i = this.category.findIndex(o => {
        return o.categoryid == 9999;
      });
      c.cnt++;
      this.category.splice(i, 1, c);
      this.currentCategory = c;
      this.apidocs[doc.route] = doc;
      this.activeRoute = doc.route;
      this.showaddsqlapi = false;
    },
    updated(doc){
        this.apidocs[doc.route] = doc;
        this.showaddsqlapi = false;
    }
  }
};
</script>
<style>
#scrollcontainer {
  height: 100%;
}
#scrollcontainer .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
<style scoped>
#apimanager {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
.apicontainer {
  width: calc(100% - 230px);
  margin-left: 20px;
  display: inline-block;
  vertical-align: top;
}
.apidoc .apihead {
  background: rgb(171, 238, 171);
  margin: 5px 0;
  cursor: pointer;
}
.apidoc .apihead > * {
  display: inline-block;
  line-height: 35px;
}
.apidoc .apihead .route {
  background: green;
  color: white;
  padding: 0 10px;
}
.apidoc .apihead i {
  margin: 0 10px;
}
.apidoc .right {
  float: right;
}
.card {
  width: 200px;
  display: inline-block;
}
.item {
  border-bottom: 1px solid #e4e4e4;
  line-height: 40px;
  padding: 0 10px;
  cursor: pointer;
}
.item:last-child {
  border-bottom: none;
}
.item.selected {
  background: #005bac;
  color: white;
}
.categoryTool {
  display: none;
  float: right;
  color: darkgray;
}
.item:hover .categoryTool {
  display: inline;
}
.doc {
  padding: 20px;
  width: 100%;
  border: 1px solid rgb(171, 238, 171);
  border-top: none;
  margin-top: -6px;
  background: #e7ffe7;
  position: relative;
}
.doctitle {
  font-weight: bold;
  font-size: 16px;
  margin-top: 20px;
}
.doc p {
  letter-spacing: 2px;
  margin: 10px 0;
}
.content {
  width: 830px;
  margin: 10px auto 0 auto;
}
.testresult {
  margin-top: 30px;
  background: black;
  color: white;
  padding: 10px;    white-space: pre-wrap;
    word-wrap: break-word;
    max-height:300px;overflow : auto;
}
.tools {
  font-size: 12px;
  color: #7c7cff;
  cursor: pointer;
}
.doctitle2 {
  font-size: 12px;
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}
.apidoc.red .apihead {
  background: #ffd9d9;
}
.apidoc.red .apihead .route {
  background: #ff5b5b;
}
.apidoc.red .doc {
  background: #fff0f0;
}
.apidoc.blue .apihead {
  background: #b2d8ff;
}
.apidoc.blue .apihead .route {
  background: #3495f9;
}
.apidoc.blue .doc {
  background: #e6f2ff;
}
.apidoc.yellow .apihead {
  background: #fbe3c0;
}
.apidoc.yellow .apihead .route {
  background: #eaa132;
}
.apidoc.yellow .doc {
  background: #fff5e6;
}
.newapi {
  float: right;
  font-size: 12px;
  line-height: 31px;
  font-weight: normal;
}
.newapi span {
  margin-left: 10px;
  color: blue;
  cursor: pointer;
}
.sqldev {
  font-size: 12px;
  position: absolute;
  top: 10px;
  right: 10px;
  color: blue;
  cursor: pointer;
}
</style>

