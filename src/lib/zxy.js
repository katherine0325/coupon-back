var request = require('request');
const requestpromise = require('request-promise');

class Zxy {
    constructor() {
        this.token = null;
    }

    async getToken() {
        if (!this.token) {
            const token = await this.getTokenCallback();
            this.token = token;
        }
        return this.token;
    }

    async createList(table_id, data) {
        // const data = await listM.findOne({}, {_id: 1})
        //                         .sort({coupon_tao_token: 1, create_time: 1})
        //                         .exec();

        // await listM.deleteOne({_id: data._id});
        // await listM.create(ctx.request.body);
        // return {code: 1, data: 'success'};
        if(!this.token) {
            // throw new Error('counld not find the token');
            await this.getToken();
        }

        // // find
        // const find_data = await requestpromise({
        //     uri: 'https://cloud.minapp.com/oserve/v1/table/53526/record',
        //     method: 'GET',
        //     headers: {
        //         Authorization: `Bearer ${this.token}`,
        //     },
        //     qs: {
        //         order_by: 'tao_token',
        //         limit: 1
        //     }
        // });

        // // delete
        // await requestpromise({
        //     uri: 'https://cloud.minapp.com/oserve/v1/table/53526/record/' + JSON.parse(find_data).objects[0].id + '/',
        //     method: 'DELETE',
        //     headers: {
        //       Authorization: `Bearer ${this.token}`,
        //     }
        // });

        // create
        await requestpromise({
            uri: `https://cloud.minapp.com/oserve/v1/table/${table_id}/record/`,
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
            json: data
        });

        return {code: 1, data: 'success'};
    }

    getTokenCallback() {
        return new Promise((resolve, reject) => {
            // 获取 code
            var opt = {
                uri: 'https://cloud.minapp.com/api/oauth2/hydrogen/openapi/authorize/',
                method: 'POST',
                json: {
                    client_id: '68fbc36dcb0c6eca924f',
                    client_secret: '9f984e3fe8836d61b77146eafcd1870299a02135'
                },
                jar: true,                // 允许记住 cookie 
                followAllRedirects: true,     // 允许重定向
            }
    
            requestpromise(opt, function(err, res, body) {
                try {
                    getToken(body.code)  // 回调调用 getToken 函数
                } catch (e) {
                    throw new Error("get token failed");
                }
            })
    
            // 获取 token
            function getToken(code) {
                var opt = {
                    uri: 'https://cloud.minapp.com/api/oauth2/access_token/',
                    method: 'POST',
                    formData: {   // 指定 data 以 "Content-Type": "multipart/form-data" 传送
                    client_id: '68fbc36dcb0c6eca924f',
                    client_secret: '9f984e3fe8836d61b77146eafcd1870299a02135',
                    grant_type: 'authorization_code',
                    code,
                    }
                }
    
                request(opt, function(err, res, body) {
                    let token = JSON.parse(body).access_token;
                    resolve(token);
                })
            }
        })
    }

    async updateImageUrl() {
        // get token
        if(!this.token) {
            await this.getToken();
        }
        // 获取全部数据
        const result = await requestpromise({
            uri: `https://cloud.minapp.com/oserve/v1/table/53526/record/`,  // 3906 对应 :table_id
            method: 'GET',
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
            qs: {     // query string, 被附加到uri的参数
            //   where: JSON.stringify({   // 可选, 参数值应经过 JSON 编码为 JSONString 后，再经过 URL 编码
            //     "price": {"$eq": 10}
            //   }),
            //   order_by: 'id',   // 可选
              offset: 160,    // 可选
              limit: 20,    // 可选
            }
        });
        const arr = JSON.parse(result).objects;

        // 循环数据
        for(let i=0; i<arr.length; i++) {
            await requestpromise({
                uri: `https://cloud.minapp.com/oserve/v1/table/53526/record/${arr[i]._id}/`,  // 3906 对应 :table_id, 5a6ee2ab4a7baa1fc083e3xx 对应 :record_id
                method: 'PUT',
                headers: {
                  Authorization: `Bearer ${this.token}`,
                },
                json: {   // 指定 data 以 "Content-Type": 'application/json' 传送
                  image_url: arr[i].image_urls[0]
                }
            });
            console.log(i);
        }
    }
}

module.exports = Zxy;