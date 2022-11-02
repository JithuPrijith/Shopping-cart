const mongoose = require('mongoose');

const schema = mongoose.Schema;
const productSchema = new schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
})

const userCartSchema = new schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        products: {
             productSchema,
             type :Array
        },
        totalPrice: {
            type: Number,
        }

    }
)

const userCart = mongoose.model('user-cart', userCartSchema);
module.exports = userCart;