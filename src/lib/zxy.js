var request = require('request');
const requestpromise = require('request-promise');

class ZxyModel {
    constructor(clientId, clientSecret, tableId) {
        this.tableId = tableId;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.request = requestpromise;
        this.token = null;
    }

    async getToken() {
        if (!this.token) {
            const token = await this.getTokenCallback();
            this.token = token;
        }
        return this.token;
    }

    async getTables() {
        if (!this.token) {
            await this.getToken();
        }
        const options = {
            method: 'GET',
            url: 'https://cloud.minapp.com/oserve/v1/table/',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`,
            }
        };
        const result = await this.request(options);
        return JSON.parse(result).objects;
    }

    async createTable(tableFields) {
        if (!this.token) {
            await this.getToken();
        }
        const result = await this.request({
            uri: 'https://cloud.minapp.com/oserve/v1/table/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`,
            },
            json: tableFields,
        });
        return result;
    }

    async updateTable(tableSchema) {
        if (!this.token) {
            await this.getToken();
        }
        const options = {
            method: 'PUT',
            url: `https://cloud.minapp.com/oserve/v1/table/${this.tableId}/`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`,
            },
            body: tableSchema,
            json: true
        };
        const result = await this.request(options);
        return result;
    }

    async deleteTable() {
        if (!this.token) {
            await this.getToken();
        }
        const options = {
            method: 'DELETE',
            url: `https://cloud.minapp.com/oserve/v1/table/${this.tableId}/`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`,
            }
        }
        const result = await this.request(options);
        return result;
    }

    async findByQuery (query, options) {
        if (!this.token) {
            await this.getToken();
        }

        const qs = {};
        const where = {};
        for (let key in query) {
            qs.where[key] = {$eq: query[key]}
        }
        qs.where = JSON.stringify(where);
        if (options.order_by) {
            qs.order_by = options.order_by;
        }
        if (options.offset) {
            qs.offset = options.offset;
        }
        if (options.limit) {
            qs.limit = options.limit;
        }

        const result = await this.request({
            uri: `https://cloud.minapp.com/oserve/v1/table/${this.tableId}/record/`,
            method: 'GET',
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
            qs,
        });

        return JSON.parse(result).objects;
    }

    async create(data) {
        if(!this.token) {
            await this.getToken();
        }

        const result = await requestpromise({
            uri: `https://cloud.minapp.com/oserve/v1/table/${this.tableId}/record/`,
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
            json: data
        });

        return {code: 1, data: result};
    }

    async updateById(record_id, query) {
        if(!this.token) {
            await this.getToken();
        }

        return this.request({
            uri: `https://cloud.minapp.com/oserve/v1/table/${this.tableId}/record/${record_id}/`,  // 3906 对应 :table_id, 5a6ee2ab4a7baa1fc083e3xx 对应 :record_id
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
            json: query
        });
    }

    async deleteById(recordId) {
        if (!this.token) {
            await this.getToken();
        }
        const options = {
            uri: `https://cloud.minapp.com/oserve/v2.2/table/${this.tableId}/record/${recordId}/`,// 3906 对应 :table_id, 5a6ee2ab4a7baa1fc083e3xx 对应 :record_id
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            }
        };
        const result = await this.request(options);
        return result;
    }

    async createRichTextGroup(groupName) {
        if (!this.token) {
            await this.getToken();
        }

        return this.request({
            method: 'POST',
            url: 'https://cloud.minapp.com/oserve/v1/content/',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.token}` },
            body: { name: groupName },
            json: true,
        });
    }

    async createRichText(contentGroupId, data) {
        if (!this.token) {
            await this.getToken();
        }

        return this.request({
            url: `https://cloud.minapp.com/oserve/v1/content/${contentGroupId}/text/`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.token}` },
            body: data,
            json: true 
        });
    }

    getTokenCallback() {
        const client_id = this.clientId;
        const client_secret = this.clientSecret;
        return new Promise((resolve, reject) => {
            // 获取 code
            var opt = {
                uri: 'https://cloud.minapp.com/api/oauth2/hydrogen/openapi/authorize/',
                method: 'POST',
                json: {
                    client_id,
                    client_secret,
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
                    client_id,
                    client_secret,
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

}

module.exports = ZxyModel;