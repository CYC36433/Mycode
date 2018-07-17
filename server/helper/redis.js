const redis = require('redis')
const config = require('../config.json')

var instance = null;

function getInstance() {
    if (instance) return instance;
    var redis = require("redis");
    config.redis.prefix = config.project_code + ":";
    instance = redis.createClient(config.redis);
    instance.on("error", function(err) {
        console.log("redis初始化连接出错：" + err);
        instance = null;
    });
    return instance;
}

function _get(key) {
    return new Promise((r1, r2) => {
        var client = getInstance();
        client.get(key, (err, value) => {
            if (err) {
                throw (err)
                r2()
            } else {
                result = value;
                r1(value);
            }
        });
    })
}
async function get(key) {
    let result = await _get(key);
    return result;
}

function set(key, value, exprires) {
    var client = getInstance();
    client.set(key, value);
    if (exprires) {
        client.expire(key, exprires * 60);
    }
}

function setJSON(key, json, exprires) {
    json = JSON.stringify(json);
    set(key, json, exprires);
}

async function getJSON(key) {
    let result = await _get(key);
    result = JSON.parse(result);
    return result;
}

module.exports = {
    set,
    get,
    setJSON,
    getJSON
}