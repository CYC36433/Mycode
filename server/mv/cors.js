const cors = require('koa2-cors')
const config = require('../config')

var c = cors({
    origin: function(ctx) {
        if (config.origins.indexOf(ctx.get("Origin")) > -1) {
            return ctx.get("Origin")
        } else {
            return false
        }
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
})

global.app.use(c)