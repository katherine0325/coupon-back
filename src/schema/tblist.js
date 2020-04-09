const mongoose = require('mongoose');

const tblistSchema = new mongoose.Schema({
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
    status: String,
    create_time: Date,
    update_time: Date,
    batchId: String,
})

module.exports = mongoose.model('tb_lists', tblistSchema);
