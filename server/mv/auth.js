const jwt = require('jsonwebtoken')
const util = require('util')
const verify = util.promisify(jwt.verify)
const config = require('../config')

const secret = config.secret
global.secret = secret

/**
 * 判断token是否可用
 */
global.app.use(async(ctx, next) => {
        try {
            const token = ctx.header.authorization
            if (token) {
                try {
                    // 解密payload，获取用户名和ID
                    let payload = await verify(token.split(' ')[1], global.secret)
                    ctx.user = payload
                } catch (err) {
                    console.log('token verify fail: ', err)
                }
            }
            await next() //此中间件是第一个加载的中间件，在此之后有添加jwtKoa({secret})，此处await会被jwtKoa抛出异常， 所以会被以下的catch处理
        } catch (err) { //次数的err是被await next()后继中间件抛出的
            if (err.status === 401) {
                ctx.status = 401
                ctx.body = {
                    success: 0,
                    message: '您未登录或登陆超时'
                }
            } else {
                debugger
                if (!err.status) {
                    err.status = 500
                    ctx.status = 500
                }
                ctx.body = {
                    message: err.message
                };
            }
        }

    } //https://segmentfault.com/a/1190000012255933 2. 添加中间件校验JWT
)

//需要验证的token路由设置
const jwtKoa = require('koa-jwt')
global.app.use(jwtKoa({ secret }).unless({ path: [/^\/api\/user\/login/, /^\/static/, /^\/index.html/] }))