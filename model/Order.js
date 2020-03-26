const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

const orderSchema = new Schema({
    ID: ObjectId,
    productId: {
        type: ObjectId,
        ref: 'Product' // 指向联合查询的model
    },
    userId: ObjectId,
    buyNum: Number,
    addressId: {
        type: ObjectId,
        ref: 'Address' // 指向联合查询的model
    },
    createDate: { type: Date, default: Date.now() }
});

mongoose.model('Order', orderSchema);