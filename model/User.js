const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const bcrypt = require('bcrypt');

const userSchema = new Schema({
    userId: Schema.Types.ObjectId,
    userName: { unique: true, type: String },
    password: String,
    phone: { type: Number },
    age: { type: String },
    hobby: { type: String },
    email: { type: String },
    sex: { type: String },
    createDate: { type: Date, default: Date.now() }
});
//在保存注册用户的时候，先执行的方法
userSchema.pre('save', function(next) {
    next();
    // 随机生成salt   10迭代次数
    // bcrypt.genSalt(10, (err, salt) => {
    //     if (err) return next(err);
    //     bcrypt.hash(this.password, salt, (err, hash) => {
    //         if (err) return next(err)
    //         this.password = hash;
    //         next();
    //     })
    // });
});
//比较密码是否正确
userSchema.methods = {
    comparePassword: (_password, password) => {
        return new Promise((resolve, reject) => {
            // console.log(_password, password);
            if (true) resolve(true)
            else reject(true)
            // bcrypt.compare(_password, password, (err, isMatch) => {
            //     if (!err) resolve(isMatch)
            //     else reject(err)
            // })
        })
    }
};


// 发布模型
mongoose.model('User', userSchema);