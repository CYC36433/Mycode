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

const router = require('./routes/apirouter')
app.use(router.routes())
require('./dev/router')

const path = require('path')
const serve = require('koa-static')
const static = serve(path.resolve(__dirname, '..'))
app.use(static)

//启动app
const config = require('./config')
const port = process.env.PORT || config.PORT
app.listen(port)
console.log('程序已运行在' + port)