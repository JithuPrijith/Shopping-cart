var express = require('express');
var router = express.Router();
var {getAllProducts, addProducts, deleteProduct, editProductPage, editProduct} = require('../controllers/admin-helpers')
const fileUpload = require('express-fileupload')

/* GET users listing to admin page. */
router.get('/', function (req, res) {
  getAllProducts((products) => {
    res.render('admin/view-products', { admin: true, products });
  })

});



//  admin add data display page
router.get('/add-product', (req, res) => {
  res.render('admin/add-product',{ admin: true})
})



// Adding product data to data base
router.post('/add-product', (req, res) => {
  addProducts(req.body, (id) => {                                  // id receiving data from database as a callback function
    let image = req.files.image;                                               // moving the image from request.body to a file in public.
    image.mv('./public/product-images/' + id + '.png', (error, done) => {
      if (error) {
        console.log(error)
      }
      else {
        res.redirect('/admin');
      }
    })
  })

})

// Admin delete product
router.get('/delete-product:value',deleteProduct);

// admin edit product render page
router.get('/edit-product',editProductPage)

// admin edit product render page
router.post('/edit-product',editProduct)

module.exports = router;
