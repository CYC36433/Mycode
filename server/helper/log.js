const { dbs } = require('./dbs');

async function log(logtype, logmsg, user, tag1, tag2) {
    await dbs('base')('sys_log').insert({ logtype, logmsg, user, tag1, tag2 });
}
module.exports = {
    log
}