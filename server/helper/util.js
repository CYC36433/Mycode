const path = require('path')
const _ = require('lodash')
const fs = require('fs')

const mapDir = d => {
    const tree = {}

    // 获得当前文件夹下的所有的文件夹和文件
    const [dirs, files] = _(fs.readdirSync(d)).partition(p => fs.statSync(path.join(d, p)).isDirectory())

    // 映射文件夹
    dirs.forEach(dir => {
        tree[dir] = mapDir(path.join(d, dir))
    })

    // 映射文件
    files.forEach(file => {
        if (path.extname(file) === '.js') {
            tree[path.basename(file, '.js')] = require(path.join(d, file))
        }
    })

    return tree
}

function loadHTML(url) {
    var http = require('http');
    var pm = new Promise(function(resolve, reject) {
        http.get(url, function(res) {
            var html = '';
            res.on('data', function(d) {
                html += d.toString()
            });
            res.on('end', function() {
                resolve(html);
            });
        }).on('error', function(e) {
            reject(e)
        });
    });
    return pm;
}

module.exports = {
    mapDir,
    loadHTML
}