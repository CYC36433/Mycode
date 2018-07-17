const config = require("../config")
const knex = require("knex")

var basedb = null;
var DBS = {}
var dbconfig = {}
basedb = knex(config.basedb)
console.log("已配置好基础数据库")

function dbs(dbname) {
    if (dbname == "base") return basedb
    return knex(dbconfig[dbname])
}

function init() {
    if (config.hasdbs) {
        basedb('dev_dbconfig').then(function(data) {
            dbconfig = {}
            data.forEach((o) => {
                dbconfig[o.name] = {
                    name: o.name,
                    client: o.client,
                    connection: {
                        host: o.host,
                        user: o.user,
                        password: o.password,
                        database: o.database,
                        timezone: '08:00'
                    }
                }
            })

            console.log("已配置好业务数据库")
        })
    }
}
init()

module.exports = {
    dbs,
    reinit: init
}