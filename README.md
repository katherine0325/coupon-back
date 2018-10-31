## 项目概述

本项目为 coupon 后台管理系统的后端api

关联使用的数据库是mongodb


## 启动
node src/server.js
出现 http://localhost:3000 即启动成功


## api

- 登录
POST /api/user/login
header: {
    Authorization: Basic new Buffer(username:password).toString('base64')
}

- 获取淘宝优惠券清单数据
GET /api/tblist/list
header: {
    Authorization: Bearer + token
}


## 如何新增一个api

- src/router.js 新require一个文件，并且新增一个路由地址
- src/controller.js 新增一个controller文件，并模仿其他的controller.js 新增一个 class
