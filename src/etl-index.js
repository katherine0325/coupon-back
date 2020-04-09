const mongoose = require('mongoose');
const config = require('./config');
mongoose.connect(`mongodb://${config.mongo.username? config.mongo.username + ':' + config.mongo.password + '@': ''}${config.mongo.host}:${config.mongo.port}/${config.mongo.dbname}`, { useNewUrlParser: true });

const Etl = require('./service/etl');

(async () => {
    const etl = new Etl();
    await etl.execute();
    await mongoose.disconnect();
    console.log('Finish');
})();
