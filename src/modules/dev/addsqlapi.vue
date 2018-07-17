<template>
  <div class='addsqlapi'>
    <el-dialog :title="title" :visible.sync="visible" @close="$emit('update:show', false)" :show="show" @open='onOpen'>
      <div class='myrow'>
        <label>选择数据库：</label>
        <el-radio-group class="detail" v-model="api.dbname" size="medium" :disabled="mode==='update'">
          <el-radio-button v-for="item in dblist" :key="item.name" :label="item.name"></el-radio-button>
        </el-radio-group>
      </div>
      <div class='myrow'>
        <label>编写SQL语句：</label>
        <el-input class="detail" type="textarea" :rows="2" :autosize="{minRows:4}" placeholder="请输入SQL语句" v-model="api.sql"></el-input>
      </div>
      <div class="myrow" v-if="api.params.length">
        <label>设置参数值：</label>
        <div style="display:inline-block;" class="detail">
          <el-input v-for="item in api.params" :key="item.param" v-model="item.sample" placeholder="请输入参数值">
            <template slot="prepend">{{item.param}}</template>
          </el-input>
        </div>
      </div>
      <div class="myrow">
        <label></label>
        <el-button class="detail" type='primary' @click="dosql">点击执行</el-button>
      </div>
      <div class="myrow" v-if="testresult">
        <label></label>
        <pre class="detail" style="background:black;color:white;display: inline-block;max-height: 300px;overflow: auto;line-height: 1em;">{{testresult}}</pre>
      </div>
      <div class='myrow'>
        <label>创建为接口：</label>
        <el-input placeholder="请输入方法名" v-model="api.methodname" class="detail" :readonly="mode==='update'">
          <template slot="prepend">
            /api/sql/
          </template>
          <el-button slot="append" type='primary' class="createbtn" @click="save">{{mode==='update'?'修改接口':'创建接口'}}</el-button>
        </el-input>
      </div>
    </el-dialog>
  </div>
</template>
 
<script>
import request from "@/util/request";
import _ from "lodash";
import "@/util";
export default {
  data() {
    return {
      visible: this.show,
      dblist: [],
      testresult: null,
      api: {
        dbname: "",
        sql: "",
        params: [],
        methodname: ""
      }
    };
  },
  props: {
    methodname: {
      type: String,
      default: ""
    },
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "未命名窗口"
    },
    mode: {
      type: String,
      default: "add" //add or update
    }
  },
  watch: {
    show() {
      this.visible = this.show;
    },
    "api.sql": function(o, n) {
      this.onSqlChange();
    }
  },
  mounted() {
    this.getDBList();
    if (this.mode == "update") {
    }
  },
  methods: {
    onOpen() {
      if (this.mode == "add") {
        this.api = {
          dbname: "",
          sql: "",
          params: [],
          methodname: ""
        };
        this.testresult = "";
      } else {
        request
          .get("/devapi/manapi/getSqlapiInfoByMethodname", {
            methodname: this.methodname
          })
          .then(r => {
            this.api.dbname = r.dbname;
            this.api.sql = r.sql;
            this.api.methodname = r.methodname;
          });
      }
    },
    getDBList() {
      request.get("/devapi/manapi/getDBList").then(r => {
        this.dblist = r;
      });
    },
    getParams(sql) {
      if (!sql) return [];
      var re = /\{([^\}]+)?\}/;
      var pars = [];
      var match;
      while ((match = re.exec(sql))) {
        sql = sql.replace(match[0], "?");
        pars.push(match[1]);
      }
      return pars.unique();
    },
    onSqlChange: _.debounce(function() {
      var pars = this.getParams(this.api.sql);
      var newpars = [];
      _.each(pars, o => {
        var obj = null;
        if (this.api.params && this.api.params.length) {
          obj = _.find(this.api.params, t => {
            return t.param == o;
          });
        }
        console.log(
          obj || {
            param: o
          }
        );
        newpars.push(
          obj || {
            param: o
          }
        );
      });
      this.api.params = newpars;
      //this.$set(this.api, 'params', newpars);
    }, 1000),
    dosql() {
      let params = {};
      this.api.params.forEach(o => {
        params[o.param] = o.sample;
      });
      let p = {
        dbname: this.api.dbname,
        sql: this.api.sql,
        params: params
      };
      request.post("/devapi/manapi/getSqlExcuteResult", p).then(r => {
        this.testresult = r;
      });
    },
    save() {
      if (this.mode === "update") {
        request.post('/devapi/manapi/updateSqlApi',this.api).then(r=>{
          this.$emit("updatesqlapi",r)
        })
      } else {
        request.post("/devapi/manapi/addNewSqlApi", this.api).then(r => {
          this.$emit("addsqlapi", r);
        });
      }
    }
  }
};
</script>
<style scoped>
.myrow {
  margin: 10px 0;
  line-height: 40px;
}
.myrow > label {
  width: 130px;
  text-align: right;
  display: inline-block;
  font-size: 14px;
  font-weight: bold;
}
.myrow .detail {
  width: calc(100% - 135px);
  vertical-align: middle;
}
.myrow .detail .el-input {
  margin: 5px 0;
}
.createbtn {
  background: #409eff !important;
  color: white !important;
  border-radius: 0 4px 4px 0;
}
</style>