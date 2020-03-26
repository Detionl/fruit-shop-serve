const Koa = require('koa');
const Router = require('koa-router');
let router = new Router();
const mongoose = require('mongoose');

router.post('/addCart', async (ctx) => {
    const Cart = mongoose.model('Cart');
    const cart = new Cart(ctx.request.body);
    let haveCart = {
        productId: ctx.request.body.productId,
        userId: ctx.request.body.userId
    };
    let addNum = ctx.request.body.buyNum;
    let cartLength = null;
    // console.log("是否有此商品")
    // // console.log(haveCart)
    await Cart.find(haveCart).exec().then((res) => {
        // console.log(res.length)
        cartLength = res.length;

    });
    if (cartLength == 0) {
        await cart.save().then(() => {
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

    } else {
        await Cart.updateOne(haveCart, { $inc: { buyNum: addNum } }).exec().then((res) => {
            ctx.body = {
                code: 200,
                message: '新增成功'
            };
        }).catch(err => {
            console.log(err);
            ctx.body = {
                code: 500,
                message: err
            };
        })


    }

});

router.get('/getCart', async (ctx) => {
    const Cart = mongoose.model('Cart');
    await Cart.find({ userId: ctx.query.userId }).populate('productId').exec().then(res => {
        ctx.body = res;
    });
});

router.post('/delCart', async (ctx) => {

    const cartId = ctx.request.body.cartId;
    // console.log("打印购物车商品id")
    // console.log(cartId)
    const Cart = mongoose.model('Cart');

    await Cart.deleteOne({ _id: cartId }).exec().then(() => {
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