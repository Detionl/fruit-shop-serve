const Koa = require('koa');
const Router = require('koa-router');
let router = new Router();
const mongoose = require('mongoose');

router.post('/addOrder', async (ctx) => {
    const Order = mongoose.model('Order');
    const Cart = mongoose.model('Cart');
    const Product = mongoose.model('Product');
    let orderArray = ctx.request.body.order;
    let cartArray = ctx.request.body.cart;
    for (let i = 0; i < orderArray.length; i++) {
        // console.log("打印接收前端的参数")
        // console.log(orderArray[i])
        let order = new Order(orderArray[i]);
        await order.save().then(() => {}).catch(err => {
            console.log(err);
            return ctx.body = {
                code: 500,
                message: err
            };
        })
        await Product.updateOne({ _id: orderArray[i].productId }, { $inc: { buyNum: -orderArray[i].buyNum, saleNum: orderArray[i].buyNum } }).exec().then(() => {

        }).catch(err => {
            console.log(err);
            return ctx.body = {
                code: 500,
                message: err
            };
        })

        await Cart.deleteOne({ _id: cartArray[i] }).exec().then(() => {

        }).catch(err => {
            console.log(err);
            return ctx.body = {
                code: 500,
                message: err
            };
        })
    }
    ctx.body = {
        code: 200,
        message: '添加成功'
    };

});

router.post('/getOrder', async (ctx) => {

    const Order = mongoose.model('Order');
    let queryObject = {};
    let skip = 1;
    let limit = 100;
    if (ctx.request.body.userId) {
        queryObject.userId = ctx.request.body.userId
    }
    // console.log("是否进入请求")
    // console.log(ctx.query)
    if (ctx.request.body.skip) {
        skip = ctx.request.body.skip
    }
    if (ctx.request.body.limit) {
        limit = ctx.request.body.limit
    }
    let length = await Order.countDocuments({});
    await Order.find(queryObject).populate('productId').populate('addressId').skip(parseInt((skip - 1) * 10)).limit(parseInt(limit)).sort({ createDate: -1 }).exec().then(res => {
        ctx.body = {
            code: 200,
            message: "获取订单成功",
            data: res,
            total: length
        }
    });
});

// router.post('/delCart', async (ctx) => {

//     const cartId = ctx.request.body.cartId;
//     // console.log("打印购物车商品id")
//     // console.log(cartId)
//     const Cart = mongoose.model('Cart');

//     await Cart.deleteOne({ _id: cartId }).exec().then(() => {
//         ctx.body = {
//             code: 200,
//             message: '删除成功'
//         };
//     }).catch(err => {
//         console.log(err);
//         ctx.body = {
//             code: 500,
//             message: err
//         };
//     })
// });
//随机获取产品

router.get('/getOrderByTime', async (ctx) => {
    const Order = mongoose.model('Order');

    //获取当前月份的前十二个月
    var dataArr = [];
    var data = new Date();
    var year = data.getFullYear();
    data.setMonth(data.getMonth() + 1, 1); //获取到当前月份,设置月份
    for (var i = 0; i < 12; i++) {
        data.setMonth(data.getMonth() - 1); //每次循环一次 月份值减1
        var m = data.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        dataArr.push(data.getFullYear() + "-" + m);
    }
    // console.log(dataArr);
    // var timeStart = dataArr[0] + "-01 0:0:0";
    // var timeEnd = dataArr[0] + "-31 23:59:59";
    let rows = [];
    for (let i = 0; i < dataArr.length; i++) {
        let timeStart = dataArr[i] + "-01 0:0:0";
        let timeEnd = dataArr[i] + "-31 23:59:59";
        // console.log(i)
        await Order.find({
            "$and": [{
                "createDate": {
                    "$gt": timeStart
                }
            }, {
                "createDate": {
                    "$lt": timeEnd
                }
            }]
        }).exec().then(res => {
            // console.log(res)
            rows.unshift({
                "日期": dataArr[i],
                "订单量": res.length
            })
        })
    }
    // dataArr.forEach((item, index) => {

    // })
    ctx.body = {
        code: 200,
        data: { columns: ["日期", "订单量"], rows },
        message: "获取时间订单成功"
    };
    // await Order.find({
    //     "$and": [{
    //         "createDate": {
    //             "$gt": timeStart
    //         }
    //     }, {
    //         "createDate": {
    //             "$lt": timeEnd
    //         }
    //     }]
    // }).exec().then(res => {
    //     console.log("打印事件订单")
    //     console.log(res)
    //     ctx.body = {
    //         code: 200,
    //         data: res,
    //         message: "获取时间订单成功"
    //     };

    // })
});


//删除用户订单
router.post('/delOrder', async (ctx) => {

    const orderId = ctx.request.body.orderId;
    // console.log("打印购物车商品id")
    // console.log(cartId)
    // 引入model
    const Order = mongoose.model('Order');

    await Order.deleteOne({ _id: orderId }).exec().then(() => {
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