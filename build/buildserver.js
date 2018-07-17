const webpack = require('webpack')
const path = require('path')
const ora = require('ora')
const spinner = ora('building for server production...')
const chalk = require('chalk')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
var fs = require('fs')
const merge = require('webpack-merge')

process.env.NODE_ENV = 'production'

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod
    });
//以下是自定义的不打包的配置，可参考https://segmentfault.com/a/1190000012113011
var customExternals = {}
customExternals["../config"] = "commonjs ./config" //json竟然也可以省略后缀
customExternals["./config"] = "commonjs ./config" //和上边那个一样，是因为有的地方用require('../config')引用，有的地方用require('./config')引用
customExternals['./dev/router'] = "commonjs ./config" //其实这里commonjs 后边随便写点什么确实可以加载到的东东
let config = {
    entry: './server/server.js',
    output: {
        path: path.resolve(__dirname, '../dist/server'),
        filename: 'server.js'
    },
    node: {
        __dirname: false
    },
    target: 'node', //告诉 webpack 打包的对象是 node 端的代码，这样一些原生模块webpack 就不会做处理,比如fs、path
    externals: merge(nodeModules, customExternals), //如果注释这里，所有的东西都打包了，在生产环境无法接外网install依赖时可以考虑注释掉这里
    plugins: [
        new CopyWebpackPlugin([ //这里是配置文件直接进行复制，上面已经配置过不再打包这个文件，这样做方便以后部署修改必要配置
            {
                from: path.resolve(__dirname, '../server/config.json'),
                to: ''
            }
        ]),
        new UglifyJsPlugin({ //这里是压缩的配置
            uglifyOptions: {
                compress: {
                    warnings: false
                }
            },
            sourceMap: false,
            parallel: true
        })
    ]
}
webpack(config, (err, stats) => {
    spinner.stop()
    if (err) throw err

    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
        chunks: false,
        chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
        console.log(chalk.red('  Build failed with errors.\n'))
        process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
    ))
})