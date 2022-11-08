const mongoose = require('mongoose');

const schema = mongoose.Schema;
const addressSchema = new schema({
    deliveryDetails : [{
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        pincode: {
            type: Number,
            required: true,
        },
        phoneNumber: {
            type: Number,
            required: true,
        }
    }]
   
})

module.exports = addressSchema;