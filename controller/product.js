const Koa = require('koa');
const Router = require('koa-router');
let router = new Router();
const mongoose = require('mongoose');
const fs = require('fs');

router.get('/insertProductInfo', async (ctx) => {
    fs.readFile('./data/product.json', 'utf8', (err, data) => {
        data = JSON.parse(data);
        console.log(data);
        let count = 0; // 计数器
        const Product = mongoose.model('Product');
        data.map((value, index) => {
            console.log(value);
            let product = new Product(value);
            // 随机生成类型 范围是1~8
            // product.type = Math.floor(Math.random() * 8) + 1;
            product.save().then(() => {
                count++;
                console.log('成功' + count);
            }).catch(err => {
                console.log('失败啦:' + error);
            });
        });
    });
    ctx.body = '导入数据';
});
//根据类型获取商品
router.get('/getProductsByType', async (ctx) => {
    const Product = mongoose.model('Product');
    await Product.find({ type: ctx.query.typeId }).skip(parseInt(ctx.query.start)).limit(parseInt(ctx.query.limit)).exec().then(res => {
        ctx.body = res;
    })
});
//根据类型和商品名获取商品
router.post('/getProductsByAll', async (ctx) => {
    const Product = mongoose.model('Product');
    let queryShop = ctx.request.body;
    let name = queryShop.name;
    let typeId = queryShop.typeId;
    let skip = queryShop.skip;
    let limit = queryShop.limit;
    let shopCondition = {};
    if (name !== "") {
        shopCondition.name = name
    }
    if (typeId !== "any") {
        shopCondition.type = typeId
    }
    // console.log("打印后台传来的参数")
    // console.log(shopCondition)
    // let length = await Product.countDocuments();
    let length = await Product.countDocuments(shopCondition);
    // console.log("商品的总长度" + length)


    await Product.find(shopCondition).skip(parseInt((skip - 1) * 10)).limit(parseInt(limit)).exec().then(res => {


        ctx.body = {
            code: 200,
            message: '获取商品成功',
            data: res,
            total: length
        };

    })
});
//获取产品
router.get('/getProductsByHot', async (ctx) => {
    const Product = mongoose.model('Product');
    await Product.find().sort({ saleNum: -1 }).skip(0).limit(8).exec().then(res => {
        ctx.body = res;
    })
});
router.get('/getProductsByRate', async (ctx) => {
    const Product = mongoose.model('Product');
    await Product.find().sort({ rate: -1 }).skip(0).limit(10).exec().then(res => {
        ctx.body = res;
    })
});
//获取商品详情
router.get('/getDetail', async (ctx) => {
    const Product = mongoose.model('Product');
    await Product.findOne({ _id: ctx.query.id }).exec().then(res => {
        ctx.body = res;
    })
});

module.exports = router;