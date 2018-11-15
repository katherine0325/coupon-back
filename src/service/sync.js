const zxyKey = true;
const request = require('request-promise');
const Zxy = require('../lib/zxy');
const zxy = new Zxy();

const list_model_name = 'tb_lists';  // 需要sync的是豆瓣列表 doubans 还是淘宝优惠券列表 tb_lists
const sync_count = 10;  // sync 的数量
const table_id = '53526';  // 知晓云的表id  // lists: 53526  themes: 55029

const doubanM = require('../schema/tblist');

const start = async () => {
    try {
    const token = await getToken();

    const data = await doubanM.find({tao_token: {$ne: null}, status: 'pre_sync'}).limit(sync_count).sort({coupon_end_time: 1}).exec();
    const ids = data.map(i => i._id);
    let num = 1;
    for (let i of data) {
        console.log(num + ': ' + i.name);
        const result = await syncOnline(token, i);
        console.log(result)
        num ++;
    }
    await doubanM.updateMany({_id: {$in: ids}}, {$set: {status: 'synced'}});
    console.log(data.map(i => i.pid));
    console.log('coupons sync finish');
    return {res: 'finish'};
    } catch (e) {
        console.error(e)
        return { res: e.toString() };
    }
}

const getToken = async () => {
    if(zxyKey == true) {
        // create 的时候会自动去getToken
        // return await zxy.getToken();
    } else {
        const tokenData = await request({
            url: 'http://47.106.211.80:3000/api/user/login',
            method: 'POST',
            headers: {
                Authorization: 'Basic ' + new Buffer('localuser:137946').toString('base64')
            }
        });

        return JSON.parse(tokenData).token;
    }
}

const syncOnline = async (token, i) => {
    const param = {
        name: i.name, 
        price: i.price, 
        pid: i.pid, 
        image_urls: i.image_urls,
        image_url: i.image_url,
        tao_token: i.tao_token,
        coupon_tao_token: i.coupon_tao_token,
        coupon_start_time: i.coupon_start_time || '',
        coupon_end_time: i.coupon_end_time || '',
        theme: i.theme || '',
        create_time: new Date(),
        update_time: new Date(),
    };

    if (zxyKey == true) {
        return await zxy.createList(table_id, param);
    } else {
        return await request({
            url: 'http://47.106.211.80:3000/api/list/create',
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + token
            },
            json: true,
            body: param,
        });
    }
}

module.exports = { start };
