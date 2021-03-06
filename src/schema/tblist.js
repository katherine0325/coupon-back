const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    pid: String,
    title: String,
    image_url: String,
    price: Number,
    monthly_sales_volume: Number,
    coupon_price: Number,
    start_expire_date: Date,
    end_expire_date: Date,
    coupon_key: String,
    tag: Array,
    type: String,
    isSyncd: Boolean,
    create_time: Date,
    update_time: Date,
    batchId: String,
    action: String,
})

module.exports = mongoose.model('temp_coupon', schema);
