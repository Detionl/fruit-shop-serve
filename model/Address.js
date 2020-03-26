const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

const addressSchema = new Schema({
    ID: ObjectId,
    userId: ObjectId,
    name: String,
    tel: Number,
    address: String,
    // addressDetail: String,
    isDefault: Boolean,
    createDate: { type: Date, default: Date.now() }
});

mongoose.model('Address', addressSchema);