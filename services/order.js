const userData = require("../models/user-signup")
const { v4: uuidv4 } = require('uuid');
const Razorpay = require('razorpay');
var  instance = new Razorpay({
    key_id: 'rzp_test_rCqgcSTzd87Bcj',
    key_secret: 'hdtbbn2ewtLyr9sNjum29itI',
});

module.exports = {
    saveAddress: (addressData, userId) => {
        try {
            return new Promise(async (resolve, reject) => {
                await userData.findOneAndUpdate({ '_id': userId },
                    {
                        $push: { 'address': addressData.deliveryDetails }
                    },
                    {
                        new: true
                    }).then((data) => {
                        console.log(data);
                        resolve(data.address)
                    })
            })
        } catch (error) {

        }
    },
    getAddress: async (reqUserId) => {
        return new Promise(async (resolve, reject) => {
            await userData.findOne({ userId: reqUserId }).then((data) => {
                resolve(data.address)
            })
        })

    },
    checkOut: (reqUserId, usercartData, totalAmount, userDatas, paymentMethod, addressIndex) => {
        try {
            return new Promise(async (resolve, reject) => {
                let addressArray = userDatas.address;
                //  console.log(addressArray, "ijhjiwdhijhb");
                //  console.log(addressIndex);
                let address = await addressArray.find((element, index, array) => { return index == parseInt(addressIndex) })
                // console.log(address);
                let orderData = await userData.aggregate([
                    {
                        $match: { _id: reqUserId }
                    },
                    // {
                    //     $unwind: {
                    //         path: '$address',
                    //         includeArrayIndex: 'address_index',
                    //     }
                    // },
                    {
                        $lookup: {
                            from: 'user-carts',
                            localField: '_id',
                            foreignField: 'userId',
                            as: 'products'
                        }
                    },
                    {
                        $project: {
                            userId: '$_id',
                            // address : 1,
                            username: 1,
                            // address_index :1,
                            product: '$products'
                        }
                    },
                    {
                        $unwind: "$product"
                    },
                    {
                        $project: {
                            userId: '$_id',
                            // address : 1,
                            username: 1,
                            // address_index :1,
                            product: "$product.products"
                        }
                    },
                    {
                        $unwind: "$product"
                    },
                    {
                        $lookup: {
                            from: 'product-datas',
                            localField: 'product.productId',
                            foreignField: '_id',
                            as: 'productsData'
                        }
                    },
                    {
                        $unwind: "$productsData"
                    },
                    {
                        $project: {
                            username: 1,
                            productId: '$product.productId',
                            quantity: '$product.quantity',
                            productName: '$productsData.name',
                            productPrice: '$productsData.price'
                        }
                    }
                ])
                // console.log(orderData);

                let orderSave = {
                    orderId: uuidv4(),
                    orderedProducts: orderData,
                    deliveryDetails: address,
                    totalPrice: totalAmount.totalPrice[0].total,
                    createdOn: new Date,
                    status: "pending",
                    paymentMethod: paymentMethod
                }
                await userData.findOneAndUpdate({ '_id': reqUserId },
                    {
                        $push: { 'orderDetails': orderSave }
                    },
                    {
                        new: true
                    }).then((data) => {
                        // console.log("saved data", data.orderDetails);
                        resolve({ orderDetails: data.orderDetails })
                    })

            })
        } catch (error) {

        }

    },
    getRazorpay: (orderId,totalPrice) => {
        return new Promise((resolve, reject) => {
            var options = {
                amount: totalPrice,  // amount in the smallest currency unit
                currency: "INR",
                receipt: orderId
            };
            instance.orders.create(options, function (err, order) {
               if(err){
                console.log(err);
               }
               else{
                resolve(order);
               }
            });
        })
    }
}