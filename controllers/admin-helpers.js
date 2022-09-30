const { find } = require('../models/add-product')
const products = require('../models/add-product')


module.exports = {
    addProducts: (Products, callback) => {
        try {
            products(Products).save()
                .then((data) => {
                    callback(data._id)
                })
                .catch((error) => {
                    console.log("error occured", error)
                })
        } catch (error) {
            console.log(error);
        }
    },

    getAllProducts: (callback) => {
        try {
            products.find().lean().then((data) => {
                callback(data)
            })
        } catch (error) {
            console.log(error)
        }

    },
    
}


