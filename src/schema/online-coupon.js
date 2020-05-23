const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    pid: String,
    title: String,
    image_url: String,
    price: Number,
    coupon_price: Number,
    start_expire_date: Date,
    end_expire_date: Date,
    coupon_key: String,
    tag: Array,
    type: String,
    create_time: Date,
    update_time: Date,
    zxy_id: String,
})

module.exports = mongoose.model('online_coupon', schema);
