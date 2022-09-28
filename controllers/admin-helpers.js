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
    }
}


