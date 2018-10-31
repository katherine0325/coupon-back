const moment = require('moment');
const tblistM = require('../schema/tblist');

class List {
    constructor() {

    }

    async getList(ctx) {
        return await tblistM.find({coupon_end_time: ctx.request.query.coupon_end_time}).exec();
    }

    async delItem(ctx) {
        return await tblistM.remove({_id: ctx.request.query.id});
    }
}

module.exports = new List;