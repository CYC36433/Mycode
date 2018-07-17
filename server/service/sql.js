const { dbs } = require("../helper/dbs")

async function getSQL(methodname) {
    var result = await dbs('base').select('sql', 'dbname').from('dev_sqlapi').where({ methodname: methodname })
    return result[0]
}
var sqlTpl = function(sql, params) {
    var re = /\{([^\}]+)?\}/
    var pars = []
    while (match = re.exec(sql)) {
        sql = sql.replace(match[0], '?')
        pars.push(params[match[1]])
    }
    return { sql, pars }
}
async function doSQL(method, params) {
    var sqlapi = await getSQL(method)
    if (sqlapi) {
        var tpl = sqlTpl(sqlapi.sql, params)
        var result
        result = await dbs(sqlapi.dbname).raw(tpl.sql, tpl.pars)
        if (result.length == 2) { // && result[1][0].catalog
            if (result[0].length == 0 || result[0][0].constructor.name == "RowDataPacket")
                return result[0]
            else
            //return _.find(result[0],function(o){return o.constructor == Array})
                result[0].find(o => o.constructor == Array)
        } else {
            return result
        }
    } else {
        return 404
    }
}

async function doSQL2(dbname, sql, params) {
    var tpl = sqlTpl(sql, params)
    var result
    result = await dbs(dbname).raw(tpl.sql, tpl.pars)
    if (result.length == 2) { // && result[1][0].catalog
        if (result[0].length == 0 || result[0][0].constructor.name == "RowDataPacket")
            return result[0]
        else
        //return _.find(result[0],function(o){return o.constructor == Array})
            result[0].find(o => o.constructor == Array)
    } else {
        return result
    }
}

module.exports = {
    doSQL,
    doSQL2
}