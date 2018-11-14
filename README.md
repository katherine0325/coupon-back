## 项目概述

本项目为 coupon 后台管理系统的后端api

关联使用的数据库是mongodb


## 启动
node src/server.js
出现 http://localhost:3000 即启动成功


## api

- 获取淘宝优惠券清单数据
GET /api/tblist/list


- 更新指定id数据为挑选过的数据
PUT /api/tblist/update?id=123456


- 更新指定id为挑选过不要的数据
PUT /api/tblist/updateUseless
body: {
    ids: ['123', '456']
}


- 更新tao_token
PUT /api/tblist/updateTaoToken
body: {
    id: 'sdfdfsdf',
    tao_token: 'sdfsdf',
    coupon_tao_token: 'sdfsdfsf'
}


- 计算选择好，等待填写淘口令的数据有多少
GET /api/tblist/chooseCount


- 计算待sync的数据有多少
GET /api/tblist/preSyncCount


- 从excel导入数据
POST /api/tblist/import
body: {
    filePath: '/doc/cc.xls',
    head: ['name', 'pid']
}



## 如何新增一个api

- src/router.js 新require一个文件，并且新增一个路由地址
- src/controller.js 新增一个controller文件，并模仿其他的controller.js 新增一个 class
