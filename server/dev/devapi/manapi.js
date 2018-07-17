const { dbs } = require("../../helper/dbs")
const { mapDir } = require("../../helper/util")
const path = require('path')

async function getApiCategoryList() {
    let result = await dbs('base')('dev_category').select()
    return result
}

async function addApiCategory(params) {
    let result = await dbs('base')('dev_category')
        .returning('categoryid')
        .insert({ categoryname: params.name })
    result = { categoryname: params.name, categoryid: result[0] }
    return result
}

async function updateCategory(params) {
    let result = await dbs('base')('dev_category').where('categoryid', params.id).update({ categoryname: params.name })
    return result
}

async function delApiCategory(params) {
    let result = await dbs('base')('dev_category').where('categoryid', params.id).del()
    return result
}

async function getSqlApiList() {
    let result = await dbs('base')('dev_sqlapi').select('methodname')
    result = result.map(o => { return '/api/sql/' + o.methodname })
    return result
}

function getFileApiRouteList(params) {
    let files = mapDir(path.resolve('server/service'))
    let rotes = []
    for (let key1 in files) {
        if (key1 !== "sql") {
            for (let key2 in files[key1]) {
                rotes.push('/api/' + key1 + '/' + key2)
            }
        }
    }
    return rotes
}

async function getApidocList() {
    let result = await dbs('base')('dev_apidoc').select()
    return result
}

async function updateApidoc(params) {
    let result = await dbs('base')('dev_apidoc').where('docid', params.id).update(params.doc)
    return result
}

async function delUselessApidoc(params) {
    let reuslt = await dbs('base')('dev_apidoc').whereIn('docid', params.docids.split(',')).del()
    return result
}

async function updateApidocRemark(params) {
    let result = await dbs('base')('dev_apidoc').where('docid', params.id)
        .update({
            remark: params.remark,
            name: params.name,
            categoryid: params.categoryid
        })
    return result
}

async function updateApidocParams(params) {
    let result = await dbs('base')('dev_apidoc').where('docid', params.id).update({ params: params.params })
    return result
}

async function updateApidocResponsedict(params) {
    let result = await dbs('base')('dev_apidoc').where('docid', params.id).update({ responsedict: params.responsedict })
    return result
}

async function addApidoc(params) {
    let result = await dbs('base')('dev_apidoc').returning('docid').insert({ route: params.route })
    let apidoc = await dbs('base')('dev_apidoc').where('docid', result[0])
    return apidoc[0]
}

async function getDBList() {
    let result = await dbs('base')('dev_dbconfig').select()
    return result
}

async function getSqlExcuteResult(params) {
    const sqlhelper = require('../../service/sql')
    let result = sqlhelper.doSQL2(params.dbname, params.sql, params.params)
    return result
}

async function addNewSqlApi(params) {
    let api = {
        methodname: params.methodname,
        dbname: params.dbname,
        sql: params.sql
    }
    await dbs('base')('dev_sqlapi').insert(api)

    params.params.forEach(o => {
        o.name = '未命名参数',
            o.remark = "未备注参数"
    })
    let doc = {
        route: '/api/sql/' + params.methodname,
        params: JSON.stringify(params.params),
        categoryid: 9999
    }
    let docid = await dbs('base')('dev_apidoc').returning('docid').insert(doc)
    let result = await dbs('base')('dev_apidoc').where('docid', docid)
    return result[0]
}

async function getSqlapiInfoByMethodname(params) {
    let result = await dbs('base')('dev_sqlapi').where({ methodname: params.methodname })
    return result[0]
}

async function updateSqlApi(params) {
    let sqlapiid = await dbs('base')('dev_sqlapi').where({ methodname: params.methodname }).update({ sql: params.sql })
    params.params.forEach(o => {
        o.name = '未命名参数',
            o.remark = "未备注参数"
    })
    let docid = await dbs('base')('dev_apidoc').where({ route: '/api/sql/' + params.methodname }).update({ params: JSON.stringify(params.params) }).returning('docid')
    let result = await dbs('base')('dev_apidoc').where('docid', docid)
    return result[0]
}

module.exports = {
    getApiCategoryList,
    addApiCategory,
    updateCategory,
    delApiCategory,
    getSqlApiList,
    getFileApiRouteList,
    getApidocList,
    updateApidoc,
    delUselessApidoc,
    updateApidocRemark,
    updateApidocParams,
    updateApidocResponsedict,
    addApidoc,
    getDBList,
    getSqlExcuteResult,
    addNewSqlApi,
    getSqlapiInfoByMethodname,
    updateSqlApi
}