const mongoose = require('mongoose');
const moment = require('moment');
var xlsx = require('node-xlsx');
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
        return await tblistM.updateMany({_id: {$in: ctx.request.body.ids}}, {status: 'useless', update_time: new Date()});
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
        return await tblistM.find({status: 'choose'}).limit(10).sort({coupon_end_time: 1}).exec();
    }

    // 统计待sync的数据有多少
    async getReadyCount(ctx) {
        const compareCouponEndTime = moment().add(5, "days").format("YYYY-MM-DD");
        return await tblistM.count({
            isReadySync: true,
            coupon_end_time: {$gte: compareCouponEndTime},
        }).exec();
    }

    // 从excel导入数据
    async importFromExcel(ctx) {
        var formatData = [];
        const data = xlsx.parse(ctx.request.body.filePath)[0].data;
        const head = ctx.request.body.head;
        data.forEach(i => {
            var json = {};
            head.forEach((j, jndex) => {
                json[j] = i[jndex]
            });
            formatData.push(json);
        });
        const result = await tblistM.create(formatData);
        return result;
    }

}

module.exports = new Tblist;