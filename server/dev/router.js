const { DBS } = require("../helper/dbs")

const router = require('koa-router')({
    prefix: '/devapi'
})

router.all('/*', async (ctx, next) => {
    var arr = ctx.params[0].split('/')
    if (arr.length > 1) {
        var filename = arr[0], method = arr[1]
        var params = ctx.method == "GET" ? ctx.request.query : ctx.request.body
        var service = require('./devapi/' + filename)
        if (typeof service[method] != "function") {
            ctx.response.status = 404
            ctx.response.body = 'method is not found'
        } else {
            var r = await service[method](params, ctx)
            ctx.body = r
        }
    } else {
        ctx.response.status = 500
        ctx.response.body = 'service and method path is required';
    }
})
global.app.use(router.routes())