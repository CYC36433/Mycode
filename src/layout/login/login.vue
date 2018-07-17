<template>
    <div>
        <div id='container' @keyup.enter="login('form')">
            <div class="title-wrapper">
            </div>
            <div class="form-wrapper">
                <div class="form-inner-wrapper">
                    <div class="form-title">
                        <h3>
                            用户登录
                            <span>UserLogin</span>
                        </h3>
                        <el-form size="small" class='form' :model="loginInfo" status-icon :rules="rules" ref="form">
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
                    </div>
                </div>
            </div>
        </div>
        <div class="copyright" style="position:absolute;bottom:20px;width:100%;">
            版权所有：<a target="_blank" href="http://fxfh.nbwater.gov.cn/">宁波市人民政府防汛防旱指挥部办公室</a>　　　技术支持：<a target="_blank" href="http://www.htwater.net">宁波弘泰水利信息科技有限公司</a>
        </div>
    </div>
</template>

<script>
    import request from '@/util/request'
    export default {
        name: 'login_page',
        data() {
            return {
                loginInfo: {
                    account: '',
                    password: ''
                },
                rules: {
                    account: [{
                        required: true,
                        message: '请输入账号',
                        trigger: 'change'
                    }],
                    password: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'change'
                    }]
                }
            }
        },
        methods: {
            login(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        //此处登陆，如果登陆成功则执行如下代码
                        //Session表示关闭浏览器就过期
                        var params = {
                            username:this.loginInfo.account,
                            password:this.loginInfo.password
                        }
                        request.get('/api/user/login',params)
                        .then(response => {
                            if(response.result){
                                this.$cookies.set('token', response.token, 'Session')
                                window.location.href = 'index.html'
                            }else{
                                this.$message.error('用户名密码错误！');
                            }
                        })
                    } else {
                        this.$message.error('请填写用户名密码');
                    }
                });
            }
        }
    }
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
    .title-wrapper {
        margin-left: 15px;
        width: 657px;
        height: 66px;
        overflow: hidden;
        background: url(./login_title.png) no-repeat;
    }
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
</style>
