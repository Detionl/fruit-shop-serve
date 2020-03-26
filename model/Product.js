const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    id: Schema.Types.ObjectId,
    name: String,
    img: String,
    price: Number,
    rate: Number,
    company: String,
    saleNum: Number,
    type: Number,
    goodId: Number,
    goodNum: Number,
    imgList: Array,
    content: String
});

mongoose.model('Product', productSchema);