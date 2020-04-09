const mongoose = require('mongoose');
const moment = require('moment');
var xlsx = require('node-xlsx');
// const sync = require('../service/sync');
const SyncZxy = require('../service/sync-zxy');
const tblistM = require('../schema/tblist');

class Tblist {
    constructor() {

    }

    // 获取tb_lists表中，优惠券结束时间大于当天五天，没有被选择过的数据
    async getList(ctx) {
        const compareCouponEndTime = moment().add(5, "days").format("YYYY-MM-DD");
        return await tblistM.find({
            status: null,
            coupon_end_time: {$gte: compareCouponEndTime},
        }).limit(20).sort({coupon_end_time: 1}).exec();
    }

    // 更新指定id数据为挑选过的数据
    async update(ctx) {
        return await tblistM.updateOne({_id: ctx.request.query.id}, {status: 'choose', update_time: new Date()});
    }

    // 更新指定id为挑选过不要的数据
    async updateUseless(ctx) {
        return await tblistM.updateMany({_id: {$in: ctx.request.body.ids}, status: null}, {status: 'useless', update_time: new Date()});
    }

    // 删除（即跳过）已选取的数据
    async updateUselessOne(ctx) {
        return await tblistM.updateMany({_id: ctx.request.body.id, status: 'choose'}, {status: 'useless', update_time: new Date()});
    }

    // 更新tao_token
    async updateTaoToken(ctx) {
        return await tblistM.updateOne({
            _id: ctx.request.body.id
        }, {
            tao_token: ctx.request.body.taoToken,
            coupon_tao_token: ctx.request.body.couponTaoToken,
            status: 'pre_sync',
            update_time: new Date(),
        })
    }

    // 筛选待sync的数据
    async filterChoose(ctx) {
        const compareCouponEndTime = moment().add(5, "days").format("YYYY-MM-DD");
        return await tblistM.find({
            status: 'choose',
            coupon_end_time: {$gte: compareCouponEndTime},
        }).limit(10).sort({coupon_end_time: 1}).exec();
    }

    // 计算选择好，等待填写淘口令的数据有多少
    async chooseCount(ctx) {
        const compareCouponEndTime = moment().add(5, "days").format("YYYY-MM-DD");
        return await tblistM.countDocuments({
            status: 'choose',
            coupon_end_time: {$gte: compareCouponEndTime},
        }).exec();
    }

    // 计算待sync的数据有多少
    async preSyncCount(ctx) {
        return await tblistM.countDocuments({status: 'pre_sync'}).exec();
    }

    // 将数据同步至知晓云
    async sync(ctx) {
        // await sync.start();
        const syncZxy = new SyncZxy();
        await syncZxy.execute();
        return { data: 'success' };
    }

    // 从excel导入数据
    async importFromExcel(ctx) {
        try {
            console.log('start to import')
            var formatData = [];
            const data = xlsx.parse('./source/' + ctx.request.body.filePath)[0].data;
            const head = ctx.request.body.head;
            data.splice(0, 1);
            console.log('compose the data')
            data.forEach(i => {
                var json = {};
                head.forEach((j, jndex) => {
                    json[j] = i[jndex]
                });
                json.type = '淘宝';
                json.tag = ['淘宝'];
                json.status = null;
                json.create_time = new Date();
                json.update_time = new Date();
                formatData.push(json);
            });
            console.log('insert the data')
            const result = await tblistM.create(formatData);
            console.log('finish')
            return result;
        } catch (e) {
            console.log(e)
            if (/E11000 duplicate key/.test(e.toString())) {
                return { code: 200 };
            } else {
                throw e;
            }
        }
    }

}

module.exports = new Tblist;