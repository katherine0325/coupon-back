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
    }
};