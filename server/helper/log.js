const { dbs } = require('./dbs');

function log(logtype, logmsg, user, tag1, tag2) {
    dbs('base')('sys_log').insert({ logtype, logmsg, user, tag1, tag2 });
}
module.exports = {
    log
}