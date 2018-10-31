const jwt = require('jsonwebtoken');
const config = require('../config');
const userM = require('../schema/user');


class User {
    constructor() {

    }

    async login(ctx) {
        // 从请求中获取用户名和密码
        let authorization = ctx.request.header.authorization.substring(6);
        const usernameAndPassword = Buffer.from(authorization, 'base64').toString().split(':');
        const username = usernameAndPassword[0];
        const password = usernameAndPassword[1];

        // 从数据库中找到用户
        const user = (await userM.find({username: username}))[0];
        if(!user) {
            throw new Error('could not find the user');
        } else {
            // 如果可以匹配则做成token，如果不能，则错报
            if(username == user.username && password == user.password) {
                var token = jwt.sign({ username: username }, config.jwtKey, {expiresIn: '1h'});
                return { token };
            } else {
                throw new Error('the password is incorrect');
            }
        }
    }
}

module.exports = new User;
