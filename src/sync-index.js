const mongoose = require('mongoose');
const config = require('./config');
mongoose.connect(`mongodb://${config.mongo.username? config.mongo.username + ':' + config.mongo.password + '@': ''}${config.mongo.host}:${config.mongo.port}/${config.mongo.dbname}`, { useNewUrlParser: true });

const Sync = require('./service/sync-zxy');

(async () => {
    const sync = new Sync();
    await sync.execute();
    await mongoose.disconnect();
    console.log('Finish');
})();
