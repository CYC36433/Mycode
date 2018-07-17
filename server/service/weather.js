const cheerio = require('cheerio')
const util = require('../helper/util');
const dayjs = require('dayjs');

async function getFY4() {
    let url = "http://www.nmc.cn/publish/satellite/FY4A-true-color.htm";
    let html = await util.loadHTML(url);
    var $ = cheerio.load(html);
    var $list = $('#plist option');
    var json = [];
    $list.each((i, item) => {
        var $item = $(item);
        var tm = $item.text().split('');
        tm.splice(6, 0, '-');
        tm.splice(4, 0, '-');
        tm = dayjs(tm.join('')).add(-8, 'hour');
        var info = {
            year: tm.format('YYYY'),
            month: tm.format('MM'),
            day: tm.format('DD'),
            str: tm.format('YYYYMMDDHHmm')
        };
        json.push({
            time: tm.add(8, 'hour').format('YYYY-MM-DD HH:mm'),
            img: `http://image.nmc.cn/product/${info.year}/${info.month}/${info.day}/WXBL/medium/SEVP_NSMC_WXBL_FY4A_ETCC_ACHN_LNO_PY_${info.str}00000.JPG`
        });
    })
    return json;
}

module.exports = {
    getFY4
}