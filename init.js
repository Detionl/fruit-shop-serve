const mongoose = require('mongoose');
const db = 'mongodb://localhost/shop';
// const db = 'mongodb://root:123456@120.24.232.12:27017/admin';
// mongodb://root:123456@localhost/shop
// 引入 schema
const glob = require('glob');
const path = require('path');
exports.initSchemas = () => {
    glob.sync(path.resolve(__dirname, './model', '*.js')).forEach(require);
};

// 连接数据库方法
exports.connect = () => {
    // 连接数据库
    mongoose.set('useCreateIndex', true);
    mongoose.connect(db, { useNewUrlParser: true });
    // 监听数据库连接
    mongoose.connection.on('disconnected', () => {
        mongoose.connect(db);
    });
    // 数据库出现错误
    mongoose.connection.on('error', error => {
        console.log(error);
        mongoose.connect(db);
    });

    // 连接的时候
    mongoose.connection.once('open', () => {
        console.log('mongodb connected success');
    });
};