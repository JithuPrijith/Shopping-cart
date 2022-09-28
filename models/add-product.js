const mongoose = require('mongoose');

const schema = mongoose.Schema;

const productSchema = new schema({
    
    name: {
        type: String
    },
    category: {
        type: String
    },
    description: {
        type: String
    },
    price:{
        type:Number
    },
    image:{
        type:String
    }
})

const Products = mongoose.model('add-product', productSchema)

module.exports = Products;