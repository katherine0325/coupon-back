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
router.put('/api/tblist/updateUselessOne', Res(tblist.updateUselessOne));
router.get('/api/tblist/filter', Res(tblist.filterChoose));
router.put('/api/tblist/updateTaoToken', Res(tblist.updateTaoToken));
router.get('/api/tblist/chooseCount', Res(tblist.chooseCount));
router.get('/api/tblist/preSyncCount', Res(tblist.preSyncCount));
router.get('/api/tblist/sync', Res(tblist.sync));
router.post('/api/tblist/import', Res(tblist.importFromExcel));

module.exports = router;
