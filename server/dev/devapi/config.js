const {dbs} = require("../../helper/dbs")

async function readconfig(params){
    return require('../../json.json')
}
module.exports = {
    readconfig
}