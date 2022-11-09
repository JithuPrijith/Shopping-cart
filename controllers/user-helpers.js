var express = require('express')
const { body, validationResult, check } = require('express-validator');
const { doSignUp, verifyUser } = require('../services/user')
const { cartDisplay, cartCount, cartChangeQuantity, cartRemoveItem, totalPrice, productData } = require('../services/product')
const userData = require('../models/user-signup');
const userCart = require('../models/user-cart');
const bcrypt = require('bcrypt')
const { Types, default: mongoose, connect } = require('mongoose');
const { json } = require('body-parser');
const {saveAddress, getAddress, checkOut,getRazorpay} = require('../services/order');



//  Express validator validating input in the server side.
module.exports = {
    confirmPassword: () => {
        return [

            check('username')
                .trim()
                .notEmpty().withMessage("name is required")
                .isString().withMessage("must be a valid name")
                .isLength({ min: 3, max: 16 }).withMessage("minimum 3 character and maximum 16"),

            check('userEmail')
                .normalizeEmail().isEmail().withMessage("enter a valid email"),

            check('userPassword')
                .trim().notEmpty().custom((value, { req }) => {
                    if (value !== req.body.userConfirmPassword) {
                        throw new Error("both password must be same")
                    }
                    return true;
                })
        ]
    },

    //  post request after the server side validadtion.
    userValidation: (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render('user/sign-up', { errors })

        }
        else {
            doSignUp(req, res).then((data) => {
                req.session.loggedIn = true;
                req.session.user = req.body;
                res.redirect('/');
            })
        }

    },

    doSignin: (req, res) => {
        try {
            return new Promise(async (resolve, reject) => {
                let user = await userData.findOne({ userEmail: req.body.loginEmail })
                if (user) {
                    bcrypt.compare(req.body.loginPassword, user.userPassword).then((status) => {
                        if (status) {
                            req.session.loggedIn = true;
                            req.session.user = user;
                            res.redirect('/');
                        }
                        else {
                            resolve({ status: false })
                            req.session.loginErr = "incorrect password";
                            res.render('user/sign-in', { "loginErr": req.session.loginErr })
                            req.session.loginErr = null;
                        }
                    })
                }
                else {
                    resolve({ status: false })
                    req.session.loginErr = "incorrect email";
                    res.render('user/sign-in', { "loginErr": req.session.loginErr })
                    req.session.loginErr = null;
                }
            })

        } catch (error) {
            console.log("ok", error);
        }
    },

    doLogout: (req, res) => {
        req.session.destroy();
        res.redirect('/');
    },

    addToCart: async (req, res) => {
        let product = req.params.id;
        try {
            return new Promise(async (resolve, reject) => {
                let productObject = {
                    productId: Types.ObjectId(req.params.id),
                    quantity: 1,
                }
                let userCartOnDb = await userCart.findOne({ userId: req.session.user._id })
                if (userCartOnDb) {
                    // userCartOnDb.products.productId.push(Types.ObjectId(req.params.id))
                    //   await  userCart(userCartOnDb).save()
                    let productExist = userCartOnDb.products.findIndex((data) => { return data.productId == product })
                    if (productExist != -1) {
                        await userCart.updateOne(
                            { 'products.productId': Types.ObjectId(product) },
                            {
                                $inc: { 'products.$.quantity': 1 }
                            }
                        ).then((data) => {
                            resolve(data)
                        })
                    }
                    else {
                        userCart.findOneAndUpdate(
                            { userId: req.session.user._id },
                            { $push: { 'products': productObject } }
                        ).then((data) => {
                            resolve(data)
                        })
                    }


                }
                else {
                    let cartObject = {
                        userId: req.session.user._id,
                        products: [productObject]
                    }
                    await new userCart(cartObject).save()
                        .then((data) => {
                            resolve(data)
                        })
                }
            }).then(async (data) => {
                res.json(data)
            }).catch((err) => {
                console.log("reject", err);
            })

        } catch (error) {

        }
    },
    cartController: async (req, res) => {
        console.log("here");
        let cartcount = await cartCount(req.session.user._id)
        await cartDisplay(req.session.user._id).then(async (cartItems) => {
            let totalAmount = await totalPrice(req.session.user._id)
            res.render('user/cart', { cartItems, cartcount, user: req.session.user, totalAmount: totalAmount.totalPrice[0].total })
        })
    },

    cartQuantityController: async (req, res) => {
        let cartData = {
            productId: req.body.product,
            userId: req.session.user._id,
            count: req.body.count,
        }
        cartChangeQuantity(cartData).then(async (data) => {
            await cartDisplay(cartData.userId).then(async (data) => {
                let totalAmount = await totalPrice(cartData.userId)
                let productData = data;
                res.json({ status: true, products: productData, totalAmount: totalAmount })
            })

        })
    },

    cartRemoveController: async (req, res) => {
        let data = {
            productId: req.params.id,
            userId: req.session.user._id
        }
        await cartRemoveItem(data).then((data) => {
            res.json({ status: true })
        })
    },


    placeOrderController: async (req, res) => {
        let userId = req.session.user._id;
        let productDetails = await cartDisplay(userId)
        let totalAmount = await totalPrice(userId)
        let AddressData = await getAddress(userId)
        res.render('user/order', { productData: productDetails, totalPrice: totalAmount.totalPrice[0].total,addressData :AddressData })
    },

    saveAddressController: async (req, res) => {
        let userId = req.session.user._id;
        let addressData = {
            deliveryDetails: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                address: req.body.address,
                pincode: req.body.pincode,
                phoneNumber: req.body.phone,
            }
        }
        await saveAddress(addressData,userId).then((data) => {
            res.json({ addressData: data })
        })
    },

    checkOutController :(req,res) => {
        try {
            return new Promise(async (resolve, reject) => {
                let reqUserId = Types.ObjectId(req.session.user._id)
                let usercartData = await userCart.findOne({userId: reqUserId})
                let totalAmount = await totalPrice(reqUserId)
                let userDatas = await userData.findOne({userId: reqUserId})
                let paymentMethod = req.body.payment;
                let addressIndex = req.body.addressIndex;
                // console.log(req.body.payment,req.body.addressIndex);
                await checkOut(reqUserId,usercartData,totalAmount,userDatas,paymentMethod,addressIndex).then(async (data) => {
                    if(paymentMethod == 'online'){
                        let orderId = data.orderDetails[0].orderId
                        let totalPrice =data.orderDetails[0].totalPrice
                        await getRazorpay(orderId,totalPrice).then((order) => {
                            res.json({order :order})
                        })
                    }
                    else {
                        res.json({cod : true})
                    }
                    
                })
            })
        } catch (error) {
            
        }
        
        
    },
    paymentController:(req,res)=>{
        res.render('user/payment')
    }

}