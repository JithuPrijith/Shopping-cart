const userCart = require('../models/user-cart')
const userOrder = require('../models/user-order')
const { Types, default: mongoose } = require('mongoose')
module.exports = {
    cartCount: async (requserId) => {
        try {
            return new Promise(async (resolve, reject) => {
                let count = 0;
                let cart = await userCart.findOne({ userId: requserId })
                if (cart) {
                    count = cart.products.length;
                }
                resolve(count);
            })
        } catch (error) {
            console.log(error);
        }


    },
    cartDisplay: async (reqUserId) => {

        try {
            return new Promise(async (resolve, reject) => {
                let cartItems = await userCart.aggregate([
                    {
                        $match: { userId: Types.ObjectId(reqUserId) }
                    },
                    {
                        $unwind: '$products'
                    },
                    {
                        $project: {
                            productId: '$products.productId',
                            quantity: '$products.quantity'
                        }
                    },
                    {
                        $lookup: {
                            from: 'product-datas',
                            localField: 'productId',
                            foreignField: '_id',
                            as: 'products',
                        }
                    },
                    {
                        $unwind :'$products'
                    }

                ])
                resolve(cartItems)
            })
        } catch (error) {
            console.log(error);
        }

    },
    cartChangeQuantity: (data) => {
        try {
            return new Promise(async (resolve, reject) => {
                let userCartOnDb = await userCart.findOne({ userId: data.userId })
                let productExist =  userCartOnDb.products.findIndex((here) => { return here.productId == data.productId })
                let quantity = await userCartOnDb.products[productExist].quantity;
                if (productExist != -1) {
                    if (data.count == '1') {
                        console.log(data.count,".......",quantity);
                        await userCart.updateOne({ 'products.productId': Types.ObjectId(data.productId) },
                            {
                                $inc: { 'products.$.quantity': parseInt(data.count) }
                            }).then(() => {
                                resolve({ count: data.count })
                            })
                    }
                    else if (data.count == '-1' && quantity > 1) {
                        console.log(data.count,".......",quantity);
                        await userCart.updateOne({ 'products.productId': Types.ObjectId(data.productId) },
                            {
                                $inc: { 'products.$.quantity': parseInt(data.count) }
                            }).then(() => {
                                resolve({ count: data.count })
                            })
                    }
                }
            })
        } catch (error) {
            console.log(error);
        }
    },
    cartRemoveItem : (data) => {
        try {
            return new Promise(async (resolve, reject) => {
                let userCartOnDb = await userCart.findOne({ userId: data.userId })
                let productExist = userCartOnDb.products.findIndex((here) => { return here.productId == data.productId })
                if(userCartOnDb && productExist != -1){
                   await userCart.updateOne({ 'products.productId' : Types.ObjectId(data.productId)},
                   {
                    $pull : {products :{ productId : Types.ObjectId(data.productId) }}
                   }).then((data) => {
                    resolve({status :true})
                   })
                }
            })
        } catch (error) {
            
        }
    },

    totalPrice : (userIdp) => {
        try {
            return new Promise(async (resolve, reject) => {
                let totalAmount = await userCart.aggregate([
                    {
                        $match : {userId : Types.ObjectId(userIdp)}
                    },
                    {
                        $unwind : '$products'
                    },
                    {
                        $project : {
                            userId :1,
                            productId : '$products.productId',
                            quantity: '$products.quantity'
                        }
                    },
                    {
                        $lookup : {
                            from : 'product-datas',
                            localField: 'productId',
                            foreignField: '_id',
                            as: 'products'
                        }
                    },
                    {
                        $unwind : '$products'
                    },
                    {
                        $project :{
                            userId :1,
                            total : { $multiply : ["$quantity", "$products.price"]}
                        }
                    },
                    {
                        $group :{
                            _id : "$userId",
                            total : {$sum : "$total"}
                        }
                    }
                    
                ])
                resolve({ totalPrice :totalAmount})
            })
        } catch (error) {
            
        }
    },

    placeOrder : (userId,productDetails,totalAmount) => {
        try {
            return new Promise(async(resolve, reject) => {
                let orderSave = {
                    
                }
                resolve()
            })
        } catch (error) {
            
        }
        
    }
}