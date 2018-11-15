const mongoose = require('mongoose');

const tblistSchema = new mongoose.Schema({
    name: String,
    price: Number,
    pid: String,
    tao_token: String,
    coupon_tao_token: String,
    url: String,
    image_urls: Array,
    image_url: String,
    status: String,
    coupon_start_time: String,
    coupon_end_time: String,
    theme: String,
    create_time: Date,
    update_time: Date,
})

module.exports = mongoose.model('tb_lists', tblistSchema);