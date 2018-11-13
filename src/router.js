const Router = require('koa-router');
const router = new Router();
const { Res } = require('./lib/common');
const index = require('./controller/index');
const user = require('./controller/user');
const tblist = require('./controller/tblist');

router.get('/', Res(index.index));

router.post('/api/user/login', Res(user.login));

router.get('/api/tblist/list', Res(tblist.getList));
router.put('/api/tblist/update', Res(tblist.update));
router.put('/api/tblist/updateUseless', Res(tblist.updateUseless));
router.get('/api/tblist/filter', Res(tblist.filterChoose));
router.put('/api/tblist/updateTaoToken', Res(tblist.updateTaoToken));
router.get('/api/tblist/count', Res(tblist.getReadyCount));
router.post('/api/tblist/import', Res(tblist.importFromExcel));

module.exports = router;
