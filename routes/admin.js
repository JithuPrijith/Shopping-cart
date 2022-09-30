var express = require('express');
var router = express.Router();
var adminHelpers = require('../controllers/admin-helpers')
const fileUpload = require('express-fileupload')

/* GET users listing to admin page. */
router.get('/', function (req, res) {
  console.log(req.body)
  adminHelpers.getAllProducts((products) => {
    res.render('admin/view-products', { admin: true, products });
  })

});



//  admin add data display page
router.get('/add-product', (req, res, next) => {
  res.render('admin/add-product')
})



// Adding product data to data base
router.post('/add-product', (req, res) => {

  adminHelpers.addProducts(req.body, (id) => {                                  // id receiving data from database as a callback function
    let image = req.files.image;                                               // moving the image from request.body to a file in public.
    image.mv('./public/product-images/' + id + '.png', (error, done) => {
      if (error) {
        console.log(error)
      }
      else {
        res.render('admin/add-product')
      }
    })
  })

})

module.exports = router;
