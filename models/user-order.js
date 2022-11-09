const mongoose = require('mongoose');

const schema = mongoose.Schema;


const userOrderSchema = new schema({
    orderId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    paymentMethod : {
        type :String
    },
    orderedProducts: {
       type :Array
    },
    deliveryDetails: {
        type: Array,

    },
    totalPrice: {
        type: Number,
        
    },
    createdOn: {
        type: Date,
        
    },
    status: {
        type: String,
    }
})
module.exports = userOrderSchema;
    