const { dbs } = require("../helper/dbs")
const jwt = require('jsonwebtoken')
const axios = require('axios')
const config = require('../config')

async function getUsers(params) {
    var u = await dbs("htbus").select("*").from("sys_user")
    return u
}
async function login(params) {
    if (!(params.username && params.password)) {
        return {
            result: false,
            loginmessage: '账号名密码不能为空'
        }
    }
    var user = await dbs('base')('sys_user').where(params).select('*')
    if (user && user.length) {
        let userToken = {
            username: user[0].username,
            dept_id: user[0].dept_id,
            user_id: user[0].user_id,
            realname: user[0].realname
        }
        let token = jwt.sign(userToken, global.secret, { expiresIn: config.login_expires })
        return {
            result: true,
            loginmessage: '登陆成功',
            token
        }
    } else {
        return {
            result: false,
            loginmessage: '登陆失败，账号密码错误'
        }
    }
}

async function bindwx(params) {
    if (!(params.wxid && params.username && params.password)) { //用户想绑定
        return {
            result: false,
            loginmessage: '账号名密码及微信用户ID不能为空'
        }
    }
    var user = await dbs('base')('sys_user').where({ username: params.username, password: params.password });
    if (user && user.length) {
        var b = await dbs('base')('sys_user').where({ username: params.username, password: params.password }).update({ wxid: params.wxid });
        let userToken = {
            username: user[0].username,
            dept_id: user[0].dept_id,
            user_id: user[0].user_id,
            realname: user[0].realname
        }
        let token = jwt.sign(userToken, global.secret, { expiresIn: config.login_expires })
        return {
            result: true,
            loginmessage: '绑定成功、登陆成功',
            token
        }
    } else {
        return {
            result: false,
            loginmessage: '绑定失败，账号密码错误'
        }
    }
}

async function wxlogin(params) {
    if (!(params.wxcode)) {
        return {
            result: false,
            loginmessage: '需要提供微信登陆码'
        }
    }
    //获取wxcode对应的wxid
    var info = await axios.get(config.api_htwx, { params: { code: params.wxcode } });
    info = info.data;
    if (info.openid) {
        //检查该微信用户的openid有没有绑定系统账号
        var user = await dbs('base')('sys_user').where({ wxid: info.openid });
        if (user && user.length) {
            let userToken = {
                username: user[0].username,
                dept_id: user[0].dept_id,
                user_id: user[0].user_id,
                realname: user[0].realname
            }
            let token = jwt.sign(userToken, global.secret, { expiresIn: '2h' })
            return {
                result: true,
                loginmessage: '登陆成功',
                token
            }
        } else {
            return {
                result: false,
                loginmessage: '未绑定',
                wxinfo: info
            }
        }
    } else {
        return {
            result: false,
            loginmessage: '二维码失效'
        }
    }
}

async function current(params, ctx) {
    return ctx.user
}

async function getMenu(params, ctx) {
    //let sql = 'SELECT menu_id AS id, pid, `name`, path, component, type, icon AS iconCls, disabled, hidden, redirect  FROM sys_menu';
    let sql = 'SELECT DISTINCT a.menu_id AS id,d.pid,d.`name`,d.path,d.component,d.type,d.icon iconCls,d.disabled,d.hidden,d.redirect FROM sys_role_menu AS a LEFT JOIN sys_user_role AS b ON a.role_id = b.role_id LEFT JOIN sys_user_role AS c ON b.role_id = c.role_id LEFT JOIN sys_menu AS d ON a.menu_id = d.menu_id WHERE c.user_id = ? order by d.order_num'
    let result = await dbs('base').raw(sql, [ctx.user.user_id])
    return result[0]
}
module.exports = {
    getUsers,
    login,
    wxlogin,
    bindwx,
    current,
    getMenu
}