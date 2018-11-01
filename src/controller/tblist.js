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
            isReadySync: false,
            coupon_end_time: {$gte: compareCouponEndTime},
        }).sort({coupon_end_time: 1}).exec();
    }

    // 更新指定id数据为挑选过的数据
    async updateList(ctx) {
        return await tblistM.update({_id: {$in: ctx.request.body.ids}}, {$set: {isReadySync: true}}, false, true).exec();
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