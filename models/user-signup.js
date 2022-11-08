const mongoose = require('mongoose');
const deliveryDetails = require('../models/address')

const schema = mongoose.Schema;

const userSchema = new schema ({
    username :{
        type : String,
        required : [true],
        unique : true,
    },
    userPassword :{
        type : String,
        required : true,
        unique: false,
    },
    userEmail : {
        type : String,
        required : true,
        unique : true,
    },
    date : {
        type : Date,
        default :Date.now,
    },
    address: {
        deliveryDetails,
        type :Array
    }
})

const userData = mongoose.model('user-datas',userSchema);
module.exports = userData;