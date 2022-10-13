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

    deleteProduct: async (req, res) => {

        try {
            let productId = req.params.value;
            products.deleteOne({ _id: productId }).then((data) => {
                res.redirect('/admin');
            })
        } catch (error) {

        }
    },
    editProductPage: (req, res) => {
        let productId = req.query.value;
        res.render('admin/edit-product', { productId })
    },

    editProduct: (req, res) => {
        try {
            let productId = req.query.value;
            products.updateOne({ _id: productId }, {
                $set: {
                    name: req.body.editedName,
                    category: req.body.editedCategory,
                    description: req.body.editedDescription,
                    price: req.body.editedPrice
                }
            }).then(async(data) => {
                res.redirect('/admin');
                return new Promise((resolve, reject) => {
                    if (req.files.editedImage) {
                        let image = req.files.editedImage;
                        
                        image.mv('./public/product-images/' + productId + '.png', (error, done) => {
                            if (error) {
                                console.log("image mov",error)
                            }
                            else {
                                console.log("image mov1")
                               
                            }
                        })
                    }    
                }).then((data)=> {
                    res.redirect('/admin');
                })
                
            })
        } catch (error) {
            console.log("catch", error);
        }

    }
}


