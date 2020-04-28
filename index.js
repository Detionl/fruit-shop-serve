const Koa = require('koa');
const app = new Koa();

// 解决跨域问题
const cors = require('koa2-cors');
app.use(cors());
// {
//     origin: ['http://localhost:8080'],
//     credentials: true
// }
// 接收前端post请求
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

// 加载路由
const Router = require('koa-router');
let user = require('./controller/user.js');
let product = require('./controller/product.js');
let type = require('./controller/type.js');
let cart = require('./controller/cart');
let address = require('./controller/address');
let order = require('./controller/order');

let router = new Router();
router.use('/user', user.routes());
router.use('/product', product.routes());
router.use('/type', type.routes());
router.use('/cart', cart.routes())
router.use('/address', address.routes())
router.use('/order', order.routes())

app.use(router.routes());
app.use(router.allowedMethods());


const { connect, initSchemas } = require('./init.js');
(async () => {
    await connect();
    initSchemas();
})();


app.use(async (ctx) => {
    ctx.body = '水果商城后台';
})

app.listen(3000, () => {
    console.log('打开水果商城服务器');
});