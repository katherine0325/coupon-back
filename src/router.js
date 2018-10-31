const Router = require('koa-router');
const router = new Router();
const { Res } = require('./lib/common');
const index = require('./controller/index');
const user = require('./controller/user');
const tblist = require('./controller/tblist');

router.get('/', Res(index.index));

router.post('/api/user/login', Res(user.login));

router.get('/api/tblist/list', Res(tblist.getList));
router.del('/api/tblist/del', Res(tblist.delItem));

module.exports = router;
