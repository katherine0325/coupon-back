## 项目概述

本项目为 coupon 后台管理系统的后端api

本项目还是淘宝联盟下载excel解析并同步到知晓云工具

关联使用的数据库是mongodb


## 启动
node src/server.js
出现 http://localhost:3000 即启动成功


## 资源文件
将资源Excel放在 source 文件夹中，解析过的Excel会被放在 source/success 文件夹中


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


- 将数据同步至知晓云
GET /api/tblist/sync


- 从excel导入数据
POST /api/tblist/import
body: {
    filePath: '/doc/cc.xls',
    head: ['name', 'pid']
}



### 如何将淘宝联盟数据传入知晓云

一、从淘宝联盟下载数据
1. 登陆淘宝联盟
2. 点击我要推广，并选择200个商品
3. 将200个商品添加进选品库
4. 进入选品库并将两百个商品下载成Excel

二、将优惠券数据从Excel转换到mongo数据库
1. 将Excel文件放到本项目source文件夹
2. npm run etl

三、将优惠券数据同步到知晓云
1. npm run sync
