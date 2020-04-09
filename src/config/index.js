require('dotenv').config();

module.exports = {
    host: process.env.HOST,
    port: process.env.PORT,
    jwtKey: process.env.JWT_KEY,
    mongo: {
        host: process.env.MONGO_HOST,
        port: process.env.MONGO_PORT,
        dbname: process.env.MONGO_DBNAME,
        username: process.env.MONGO_USERNAME,
        password: process.env.MONGO_PASSWORD,
    },
    zxyConfig: {
        tableId: '95907',
        clientId: 'b0cf25aba943a9f0bacf',
        clientSecret: 'da755396c112f200e1f0b4ab74404830858dfdcd',
    }
};