const Koa = require('koa');
const Router = require('koa-router');
let router = new Router();
const mongoose = require('mongoose');
const fs = require('fs');

router.get('/insertType', async (ctx) => {
    fs.readFile('./data/type.json', 'utf8', (err, data) => {
        data = JSON.parse(data);
        let count = 0;
        const Type = mongoose.model('Type');
        data.map((value, index) => {
            let type = new Type(value);
            type.save().then(() => {
                count++;
                console.log('成功' + count);
            }).catch(err => {
                console.log('失败:' + err);
            })
        });
    });
    ctx.body = '导入数据';
});

router.get('/getTypes', async (ctx) => {
    const Type = mongoose.model('Type');
    await Type.find({}).exec().then(res => {
        ctx.body = {
            data: res,
            code: 200,
            message: '注册成功'
        };
    })
});

router.get('/getCount', async (ctx) => {
    const Type = mongoose.model('Type');
    const Order = mongoose.model('Order');
    const User = mongoose.model('User');
    const Product = mongoose.model('Product');
    let count = {};
    count.type = await Type.countDocuments({});
    count.order = await Order.countDocuments({});
    count.user = await User.countDocuments({});
    count.product = await Product.countDocuments({});
    ctx.body = {
        code: 200,
        message: "获取文档长度成功",
        data: count
    }
});



module.exports = router;