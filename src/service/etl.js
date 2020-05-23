const path = require('path');
const fs = require('fs');
const moment = require('moment');
const _ = require('lodash');
const xlsx = require('node-xlsx');
const batchModal = require('../schema/batch');
const onlineCouponModel = require('../schema/online-coupon');
const tblistM = require('../schema/tblist');

class Etl {
    constructor() {
        this.sourceFolderPath = path.join(__dirname, '..', '..', 'source');
        this.header = ['pid', 'title', 'image_url','X','X','price','monthly_sales_volume','X','X', 'X','X','X','X','X','X','coupon_price','start_expire_date','end_expire_date','X','coupon_key','X','X'];
        this.batchId = null;
        this.fileName = '';
    }

    async execute() {
        await this.createBatch();
        await this.deleteTempCoupon();
        await this.deleteExpireCoupon();
        this.getFileName();
        await this.setFileName();
        await this.insertToTemp();
        await this.predict();
        await this.summary();
        await this.successHandler();
    }

    getFileName() {
        const files = fs.readdirSync(this.sourceFolderPath);
        const [ file ] = files.filter(i => /^c/.test(i));
        if (!file) {
            throw new Error('Could not find the file');
        }
        this.fileName = file;
    }

    async createBatch() {
        const res = await batchModal.create({status: 'etlStart', createdAt: new Date(), createdBy: 'K'});
        this.batchId = res.id;
    }

    async setFileName() {
        await batchModal.updateOne({_id: this.batchId}, {$set: {fileName: this.fileName}});
    }

    async insertToTemp() {
        var formatData = [];
        const data = xlsx.parse(path.join(this.sourceFolderPath, this.fileName))[0].data;
        data.splice(0, 1);
        console.log('compose the data')
        data.forEach(i => {
            var json = {};
            this.header.forEach((j, jndex) => {
                json[j] = i[jndex]
            });
            json.isCouponKey = json.coupon_key ? true : false;
            json.coupon_key = '【立即领券】长安并复制' + json.coupon_key + '打开手机淘宝领券下单';
            json.type = '淘宝';
            json.tag = ['淘宝'];
            json.isSyncd = false;
            json.create_time = new Date();
            json.update_time = new Date();
            json.batchId = this.batchId;
            if (json.isCouponKey) {
                formatData.push(json);
            }
        });
        console.log('insert the data')
        const result = await tblistM.create(formatData);
    }

    async predict() {
        const coupons = await tblistM.find({});
        for (const coupon of coupons) {
            let action = 'ignore';
            const onlineCouple = await onlineCouponModel.find({pid: coupon.pid});
            if (_.isEmpty(onlineCouple)) {
                action = 'insert';
            } else {
                const isSameCoupon = this.compareCoupon(onlineCouple, coupon);
                if (isSameCoupon) {
                    action = 'ignore';
                } else {
                    action = 'update';
                }
            }
            await tblistM.updateOne({_id: coupon._id}, {$set: { action }});
        }
    }

    deleteTempCoupon() {
        return tblistM.deleteMany({});
    }

    async deleteExpireCoupon() {
        await onlineCouponModel.deleteMany({end_expire_date: {$lte: new Date()}});
        await onlineCouponModel.deleteMany({update_time: {$lte: moment().subtract(30, 'days')}});
    }

    async summary() {
        const result = await tblistM.aggregate([
            { $group: { _id: '$action', count: {$sum: 1} } },
        ]);
        const summary = {};
        result.forEach(i => {
            summary[i._id] = i.count;
        });
        console.log(summary);
        await batchModal.updateOne({_id: this.batchId}, {$set: {summary}});
    }

    async successHandler() {
        fs.renameSync(this.sourceFolderPath + '/' + this.fileName, this.sourceFolderPath + '/success/' + this.fileName);
        await batchModal.updateOne({_id: this.batchId}, {$set: {status: 'etlSuccess'}});
    }

    compareCoupon(oldCoupon, newCoupone) {
        const comparableFields = ['price', 'coupon_price', 'start_expire_date', 'end_expire_date', 'coupon_key'];
        const comparableNewCoupon = _.pick(newCoupone, comparableFields);
        const comparableOldCoupon = _.pick(oldCoupon, comparableFields);
        const isSameRegistry = _.isMatchWith(comparableNewCoupon, comparableOldCoupon, (newValue, existedValue) => {
        if ((newValue === null || newValue === '') && (existedValue === null || existedValue === '')) {
            return true;
        }
        });
        return isSameRegistry;
    }
}

module.exports = Etl;
