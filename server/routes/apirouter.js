const { DBS } = require("../helper/dbs")
const { isCache } = require('../helper/apiset')
const redis = require('../helper/redis')

const router = require('koa-router')({
    prefix: '/api'
})

router.all('/*', async(ctx, next) => {
    var arr = ctx.params[0].split('/')
    var route = '/api/' + ctx.params[0];
    if (arr.length > 1) {
        var filename = arr[0],
            method = arr[1]
        var params = ctx.method == "GET" ? ctx.request.query : ctx.request.body
        var service = require('../service/' + filename)
        var cache = await isCache(route);
        if (cache) {
            var cache_r = await redis.getJSON(route);
            if (cache_r) {
                ctx.response.body = cache_r;
                return;
            }
        }
        if (filename == "sql") {
            var _r = await service["doSQL"](method, params);
            if (_r == 404) {
                ctx.response.status = 404;
                ctx.response.body = 'method is not found';
            } else {
                if (cache) {
                    redis.setJSON(route, _r, cache);
                }
                ctx.response.body = _r;
            }
            /*var r={};
            try{
                var _r = await service["doSQL"](method,params);
                if(_r==404){
                    //ctx.response.status = 404
                    //ctx.response.body = 'method is not found'
                    r.code = 1;r.message="没有找到此接口";r.data=null;
                }else{
                    r.code = 0;r.message = "请求成功";r.data = _r;
                }
                ctx.body = r;
            }catch(e){
                r.code = 1;r.message=e.message;r.data=null;
                ctx.response.body = r;
            }*/
        } else {
            if (typeof service[method] != "function") {
                ctx.response.status = 404
                ctx.response.body = 'method is not found'
            } else {
                var r = await service[method](params, ctx);
                if (cache) {
                    redis.setJSON(route, r, cache);
                }
                ctx.body = r
            }
        }
    } else {
        ctx.response.status = 500
        ctx.response.body = 'service and method path is required';
    }
})
module.exports = router