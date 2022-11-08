const mongoose = require('mongoose');

const schema = mongoose.Schema;


const userOrderSchema = new schema({
    orderDetails: {
        type: Array,
        required: true,
    },
    deliveryDetails: {
        type: Array,

    },
    totalPrice: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    }
})
const userOrder = mongoose.model('user-order', userOrderSchema);

module.exports = userOrder;
    