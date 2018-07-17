//初始化应用对象
const Koa = require('koa')
const app = new Koa()
global.app = app

//初始化数据库
require('./helper/dbs')

//以下是初始化各中间件
const bodyParser = require('koa-bodyparser')
app.use(bodyParser()) //body解析中间件

require('./mv/cors') //跨域中间件
require('./mv/auth') //验证、token中间件

const router = require('./routes/apirouter') //服务端接口路由中间件
app.use(router.routes())
require('./dev/router') //开发中间相关服务端接口路由，此路由在打包后会失效，请放心使用

const path = require('path')
const serve = require('koa-static')
const static = serve(path.resolve(__dirname, '..'))
app.use(static) //静态文件服务器，承载客户端

//启动app
const config = require('./config')
const port = process.env.PORT || config.PORT
app.listen(port)
console.log('程序已运行在' + port)