# joseph

> 弘泰公司基于node和vue的全栈开发框架，取名于圣经人物“约瑟”，意为敏捷强壮。

> 框架技术栈：nodejs、koa2、vue2、Element

## 运行调试与打包

``` bash
# 初始化安装依赖，cnpm的安装自行百度
cnpm install

# 本地运行服务端、客户端
npm run dev

# 单独运行服务端
npm run server

# 单独运行客户端
npm run client

# 打包客户端代码
npm run build

# 打包服务端代码
npm run buildserver
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 框架特性（未全部完成，持续更新中）
1. 三端全栈。数据库端mysql、服务端nodejs、客户端vue2+element
1. 登陆页、主页、页面结构、菜单、工作区、地图、登出...
1. 与服务端使用jwt保持上下文，前后端完全分离
1. 数据库表管理菜单，方便调整菜单结构
1. 自带用户管理、角色管理、权限管理、日志管理等系统功能
1. 服务端具备jwt、router接口文件独立、文件上传下载、数据redis缓存、excel解析及文档生成、定时任务、log4js日志输出、websocket等能力
1. 开发中心配备快速服务端及客户端设置、模块市场、模块共享、菜单设置、接口管理等功能
1. 打包部署一站式，同时可打包服务端客户端代码，客户端服务端运行于同一端口，客户端静态文件使用koa-static承载，打包后的代码方便配置

## 新手引导
> 准备开发环境：nodejs、vscode、git、mysql(5.7.17及以上)，安装cnpm，请自行百度

> 下载框架源码，请使用git的clone功能，或者直接下载zip包，然后在vscode中打开自己的代码所在文件夹，在vscode中开发即可

> 安装好mysql后，借助Navicat(v12)工具创建数据库并执行database.sql文件，在server/config.json中配置自己的数据库

> 为避免后期服务端功能冲突，务必修改自己的项目编码，server/config.json中的project_code值为与其他人不冲突的字符串（后期我们会专门在开发中心进行统一管理）

> 如果使用缓存，自行安装redis，并配置server/config.json

> 开发前先初始化 cnpm install

> 运行及调试，建议使用vscode中的debug功能启动服务端，启动客户端使用命令npm run client