// 结合 await 使用，可暂停N毫秒
const sleep = async (ms) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true)
        }, ms);
    });
}

// 返回函数封装
const Res = controller => {
    return async ctx => {
        try {
            return ctx.body = await controller(ctx);
        } catch(e) {
            // 这里可以写online日志
            throw e;
        }
    }
}

module.exports = {
    sleep,
    Res,
};