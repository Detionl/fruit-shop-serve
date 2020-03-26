const Router = require('koa-router');
let router = new Router();
const mongoose = require('mongoose');

router.post('/registUser', async (ctx) => {
    // 获取model
    const User = mongoose.model('User');
    // 接收post请求封装成user对象
    let newUser = new User(ctx.request.body);
    // 使用save保存用户信息
    await newUser.save().then(() => {
        ctx.body = {
            code: 200,
            message: '注册成功'
        };
    }).catch(err => {
        ctx.body = {
            code: 500,
            message: err
        };
    });
});


router.post('/loginUser', async (ctx) => {
    // 接收前端发送的数据
    let loginUser = ctx.request.body;
    let userName = loginUser.userName;
    let password = loginUser.password;
    // 引入model
    const User = mongoose.model('User');
    // 查询用户名是否存在 存在再去比较密码
    await User.findOne({ userName: userName }).exec().then(async (result) => {
        if (result) {
            let newUser = new User();
            // await newUser.comparePassword(password, result.password)
            //     .then(isMatch => {
            //         // 登录成功

            //     })
            if (password == result.password) {
                ctx.body = {
                    code: 200,
                    message: '登录成功',
                    userInfo: result
                };

            } else { // 登录失败
                ctx.body = {
                    code: 201,
                    message: '密码错误'
                };
            }

        } else {
            ctx.body = {
                code: 202,
                message: '用户名不存在'
            };
        }
    })

});

router.post('/getUser', async (ctx) => {
    // 接收前端发送的数据
    let queryUser = ctx.request.body;
    let userName = queryUser.name;
    let phone = queryUser.phone;
    let sex = queryUser.sex;
    let skip = 1;
    let limit = 100;
    // 引入model
    if (queryUser.skip) {
        skip = queryUser.skip;
    }
    if (queryUser.limit) {
        limit = queryUser.limit;
    }
    const User = mongoose.model('User');
    let userCondition = {};
    if (userName !== "") {
        userCondition.userName = userName
    }
    if (phone !== "") {
        userCondition.phone = phone
    }
    if (sex !== 'any') {
        userCondition.sex = sex
    }
    let length = await User.countDocuments(userCondition);
    await User.find(userCondition).skip(parseInt((skip - 1) * 10)).limit(parseInt(limit)).exec().then(async (result) => {
        if (result) {
            // let newUser = new User();
            // await newUser.comparePassword(password, result.password)
            //     .then(isMatch => {
            //         // 登录成功

            //     })
            if (result instanceof Array) {
                ctx.body = {
                    code: 200,
                    message: '登录成功',
                    userInfo: result,
                    total: length
                };

            } else { // 登录失败
                ctx.body = {
                    code: 201,
                    message: '登录失败'
                };
            }

        } else {
            ctx.body = {
                code: 202,
                message: '用户名不存在'
            };
        }
    })

});


router.post('/delUser', async (ctx) => {

    const userId = ctx.request.body.userId;
    // console.log("打印购物车商品id")
    // console.log(cartId)
    // 引入model
    const User = mongoose.model('User');

    await User.deleteOne({ _id: userId }).exec().then(() => {
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


router.post('/editUser', async (ctx) => {

    const user = ctx.request.body;
    // console.log("打印购物车商品id")
    // console.log(cartId)
    // 引入model
    const User = mongoose.model('User');
    await User.updateOne({ _id: user._id }, { $set: user }).exec().then((res) => {
        ctx.body = {
            code: 200,
            message: '修改成功',
            data: res
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