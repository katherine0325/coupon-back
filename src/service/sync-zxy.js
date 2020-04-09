const Zxy = require('../lib/zxy');
const { sleep } = require('../lib/common');
const tbListModel = require('../schema/tblist');
const batchModel = require('../schema/batch');
const { zxyConfig } = require('../config');

class SyncZxy {
    constructor() {
        this.couponZxyModel = new Zxy(zxyConfig.clientId, zxyConfig.clientSecret, zxyConfig.tableId);
    }

    async execute() {
        let index = 1;
        const batch = await batchModel.findOne({status: {$in: ['etlSuccess', 'pushStart']}});
        if (!batch) {
            throw new Error('No batch ready for sync');
        }
        await batchModel.updateOne({_id: batch._id}, {$set: {status: 'pushStart'}});
        const coupons = await tbListModel.find({batchId: batch._id, status: null}).sort({monthly_sales_volume: 1}).limit(200);
        for (const coupon of coupons) {
            console.log(index);
            await this.couponZxyModel.create(coupon);
            await tbListModel.updateOne({_id: coupon._id}, {$set: {status: 'synced'}});
            index ++;
            await sleep(1000);
        }
        await batchModel.updateOne({_id: batch._id}, {$set: {status: 'pushSuccess'}});
    }
}

module.exports = SyncZxy;
