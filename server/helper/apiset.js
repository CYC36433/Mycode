const { dbs } = require('./dbs');
var apis = null;
async function initApis() {
    let result = await dbs('base')('dev_apidoc').select('docid', 'route', 'cache');
    var obj = {};
    result.forEach(o => {
        obj[o.route] = o;
    });
    apis = obj;
}
async function getApis() {
    if (!apis) {
        await initApis();
    }
    return apis;
}
/**
 * 是否缓存，返回Int，0为不缓存，单位分钟，其他数值为具体缓存时长
 */
async function isCache(route) {
    let _apis = await getApis();
    var result = 0;
    if (_apis[route]) {
        result = _apis[route]['cache'];
    }
    return result;
}
module.exports = {
    initApis,
    getApis,
    isCache
}