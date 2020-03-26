const Koa = require('koa');
const Router = require('koa-router');
let router = new Router();
const mongoose = require('mongoose');

router.post('/addAddress', async (ctx) => {
    const Address = mongoose.model('Address');
    const address = new Address(ctx.request.body);
    await address.save().then(() => {
        ctx.body = {
            code: 200,
            message: '添加成功'
        };
    }).catch(err => {
        console.log(err);
        ctx.body = {
            code: 500,
            message: err
        };
    })
});

router.get('/getAddress', async (ctx) => {
    const Address = mongoose.model('Address');
    await Address.find({ userId: ctx.query.userId }).exec().then(res => {
        ctx.body = {
            code: 200,
            message: '获取成功',
            data: res
        };
    });
});

router.post('/delAddress', async (ctx) => {

    const addressId = ctx.request.body.addressId;
    // console.log("打印地址id")
    // console.log(cartId)
    const Address = mongoose.model('Address');

    await Address.deleteOne({ _id: addressId }).exec().then(() => {
        ctx.body = {
            code: 200,
            message: '删除成功'
        };
    }).catch(err => {
        console.log(err);
        ctx.body = {
            code: 500,
            message: err
        };
    })
});

module.exports = router;