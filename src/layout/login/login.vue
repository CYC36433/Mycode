<template>
    <div>
        <div id='container' @keyup.enter="login('form')">
            <div class="title-wrapper">
              <iconfont name="icon-htwater" style="width:65px;height:65px;"></iconfont>
              <span>{{title}}</span>
            </div>
            <div class="form-wrapper">
                <div class="form-inner-wrapper">
                    <template v-if="showQR">
                        <iconfont v-if="logintype=='form'" name="icon-QRcode-o" class='login-type' @click.native="changetype('qr')"></iconfont>
                        <iconfont v-else name="icon-form" class='login-type' @click.native="changetype('form')" style="color:#2a6aa2"></iconfont>
                    </template>
                    <div class="form-title">
                        <h3>
                            用户登录
                            <span>UserLogin</span>
                        </h3>
                        <el-form v-if="logintype=='form'" size="small" class='form' :model="loginInfo" status-icon :rules="rules" ref="form">
                            <el-form-item prop="account">
                                <el-input v-model="loginInfo.account" prefix-icon="el-icon-info"></el-input>
                            </el-form-item>
                            <el-form-item prop="password">
                                <el-input type="password" v-model="loginInfo.password" prefix-icon="el-icon-view"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="login('form')" size="small">登录</el-button>
                            </el-form-item>
                        </el-form>
                        <div v-else id="login_qr_container"></div>
                    </div>

                </div>
            </div>
        </div>
        <div class="copyright" style="position:absolute;bottom:20px;width:100%;">
            版权所有：
            <a target="_blank" href="http://fxfh.nbwater.gov.cn/">宁波市人民政府防汛防旱指挥部办公室</a>　　　技术支持：
            <a target="_blank" href="http://www.htwater.net">宁波弘泰水利信息科技有限公司</a>
        </div>
        <el-dialog title="将微信账号绑定到系统用户" :visible.sync="dialogFormVisible" width="600px">
            <p style="margin-left:100px;color:red;">您好{{wxinfo.nickname}}，首次微信登陆需绑定系统原有账号，绑定后可直接扫描登陆。</p>
            <el-form :model="loginInfo">
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="loginInfo.account" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input v-model="loginInfo.password" auto-complete="off" type="password"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="bindwx">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import request from "@/util/request";
import iconfont from "@/components/iconfont";
import "@/assets/iconfont";
import config from "../../static/config";
export default {
  name: "login_page",
  components: {
    iconfont
  },
  data() {
    return {
      title:config.title,
        dialogFormVisible:false,
        formLabelWidth: '100px',
        wxinfo:{},
      loginInfo: {
        account: "",
        password: ""
      },
      rules: {
        account: [
          {
            required: true,
            message: "请输入账号",
            trigger: "change"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "change"
          }
        ]
      },
      showQR: config.wxQR,
      logintype: "form" //qr form
    };
  },
  computed:{
      params(){
        var pattern = /(\w*)=([a-zA-Z0-9\u4e00-\u9fa5]+)/ig, params = {};//定义正则表达式和一个空对象
        decodeURIComponent(window.location.href, true).replace(pattern, function(a, b, c){ params[b] = c; });
        return params;
      }
  },
  mounted(){
      if(this.params['code']){
          this.wxlogin();
      }
  },
  methods: {
      bindwx(){
          request.get('/api/user/bindwx',{
            wxid:this.wxinfo.openid,
            username: this.loginInfo.account,
            password: this.loginInfo.password
          }).then(response=>{
            if (response.result) {
                this.$cookies.set("token", response.token, "Session");
                window.location.href = "index.html";
              }
          });
      },
    wxlogin(){
request.get('/api/user/wxlogin',{wxcode:this.params.code}).then(response=>{
              if (response.result) {
                this.$cookies.set("token", response.token, "Session");
                window.location.href = "index.html";
              } else if(response.loginmessage==="未绑定") {
                  this.wxinfo = response.wxinfo;
                this.dialogFormVisible = true;
              }else{
                this.$message.error(response.loginmessage);
              }
          });
    },
    login(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          //此处登陆，如果登陆成功则执行如下代码
          //Session表示关闭浏览器就过期
          var params = {
            username: this.loginInfo.account,
            password: this.loginInfo.password
          };
          request.get("/api/user/login", params).then(response => {
            if (response.result) {
              this.$cookies.set("token", response.token, "Session");
              window.location.href = "index.html";
            } else {
              this.$message.error("用户名密码错误！");
            }
          });
        } else {
          this.$message.error("请填写用户名密码");
        }
      });
    },
    changetype(tp) {
      this.logintype = tp;
      this.$nextTick(() => {
        if (tp == "qr") {
          !function(a,b,c){function d(a){var c="default";a.self_redirect===!0?c="true":a.self_redirect===!1&&(c="false");var d=b.createElement("iframe"),e="https://open.weixin.qq.com/connect/qrconnect?appid="+a.appid+"&scope="+a.scope+"&redirect_uri="+a.redirect_uri+"&state="+a.state+"&login_type=jssdk&self_redirect="+c;e+=a.style?"&style="+a.style:"",e+=a.href?"&href="+a.href:"",d.src=e,d.frameBorder="0",d.allowTransparency="true",d.scrolling="no",d.width="300px",d.height="400px";var f=b.getElementById(a.id);f.innerHTML="",f.appendChild(d)}a.WxLogin=d}(window,document);
          var obj = new WxLogin({
            id: "login_qr_container", //div的id
            appid: "wx19bcfbbff4ade3e6",
            scope: "snsapi_login", //写死
            redirect_uri: encodeURI(
              "http://www.htwater.net:8090/get-weixin-code.html?redirect_uri="+window.location.origin+"/index.html"
            ),
            state: "",
            style: "black", //二维码黑白风格
            href: ""
          });
        }
      });
    }
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  background: #2a6aa2;
}
#container {
  width: 848px;
  margin: 0 auto;
  padding-top: 100px;
}
.title-wrapper *{
  color:white;vertical-align: middle;margin-left:10px;
}
.title-wrapper span{font-size:30px;letter-spacing: 6px;}
.form-wrapper {
  position: relative;
  height: 391px;
  background: url(./login_bg.png) no-repeat;
  background-size: cover;
}
.form-inner-wrapper {
  position: absolute;
  top: 50px;
  right: 100px;
  width: 300px;
}
.form-wrapper .form-title {
  margin-bottom: 30px;
}
.form-title h3 {
  color: #c46118;
  font-size: 24px;
  margin-top: 20px;
  margin-bottom: 10px;
  font-family: inherit;
  font-weight: 500;
  line-height: 1.1;
}
.form-title span {
  color: #a5acb2;
  font-size: 18px;
  font-family: Arial;
}
.copyright {
  color: #d3f2ff;
  text-align: center;
  position: absolute;
  bottom: 20px;
  width: 100%;
}
.copyright a {
  color: #d3f2ff;
  text-decoration: none;
}
.form {
  margin-top: 30px;
}
.el-button--primary {
  background-color: #337ab7;
  border-color: #2e6da4;
  float: right;
}
.el-button--primary span {
  font-size: 14px;
  color: white;
}
.login-type {
  width: 26px !important;
  height: 26px !important;
  position: absolute;
  top: 22px;
  right: 5px;
  cursor: pointer;
}
#login_qr_container {
  overflow: hidden;
  width: 300px;
  height: 287px;
      transform: scale(0.8);
    transform-origin: center top;
}
#login_qr_container iframe {
  margin-top: -50px;
}
</style>
