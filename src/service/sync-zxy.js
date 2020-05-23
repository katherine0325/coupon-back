const Zxy = require('../lib/zxy');
const { sleep } = require('../lib/common');
const tbListModel = require('../schema/tblist');
const batchModel = require('../schema/batch');
const onlineCouponModel = require('../schema/online-coupon');
const { zxyConfig } = require('../config');

class SyncZxy {
    constructor() {
        this.couponZxyModel = new Zxy(zxyConfig.clientId, zxyConfig.clientSecret, zxyConfig.tableId);
        this.batchId = null;
    }

    async execute() {
        await this.getBatch();
        await this.syncCoupons();
    }

    async getBatch() {
        const batch = await batchModel.findOne({status: {$in: ['etlSuccess', 'pushStart']}});
        if (!batch) {
            throw new Error('No batch ready for sync');
        }
        await batchModel.updateOne({_id: batch._id}, {$set: {status: 'pushStart'}});
        this.batchId = batch._id;
    }

    async syncCoupons() {
        let index = 1;
        const coupons = await tbListModel.find({batchId: this.batchId, isSyncd: false, action: {$ne: 'ignore'}}).sort({monthly_sales_volume: 1}).limit(200);
        for (const coupon of coupons) {
            console.log(index ++);
            if (coupon.action === 'insert') {
                const zxyRes = await this.couponZxyModel.create(coupon);
                await onlineCouponModel.create({
                    pid: coupon.pid,
                    title: coupon.title,
                    image_url: coupon.image_url,
                    price: coupon.price,
                    coupon_price: coupon.coupon_price,
                    start_expire_date: coupon.start_expire_date,
                    end_expire_date: coupon.end_expire_date,
                    coupon_key: coupon.coupon_key,
                    tag: coupon.coupon_key,
                    type: coupon.type,
                    create_time: coupon.create_time,
                    update_time: coupon.update_time,
                    zxy_id: zxyRes.data._id});
            } else if (coupon.action === 'update') {
                await this.couponZxyModel.updateById(coupon.zxy_id, coupon);
                await onlineCouponModel.updateOne({pid: coupon.pid}, {$set: coupon});
            } else {
                console.log(`The action is not expect. ${coupon._id}: ${coupon.action}`);
                continue;
            }
            await this.updateTblistSyncFlag(coupon._id);
            await sleep(1000);
        }
        await this.successHandler();
    }

    updateTblistSyncFlag(couponId) {
        return tbListModel.updateOne({_id: couponId}, {$set: {isSyncd: true}});
    }

    successHandler() {
        return batchModel.updateOne({_id: this.batchId}, {$set: {status: 'pushSuccess'}});
    }
}

module.exports = SyncZxy;
