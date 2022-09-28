var express = require('express');
var router = express.Router();
var adminHelpers = require('../controllers/admin-helpers')
const fileUpload = require('express-fileupload')

/* GET users listing to admin page. */
router.get('/', function(req, res) {
  
  res.render('admin/view-products', { admin:true });
});



//  admin add data display page
router.get('/add-product', (req,res,next) => {
  res.render('admin/add-product')
})



// Adding product data to data base
router.post('/add-product', (req,res) => {
  
  adminHelpers.addProducts(req.body, (id) =>{
    console.log(id)
    let image = req.files.image;
    image.mv('./public/images/product-images/'+id+'.jpg', (error,done) =>{
      if(error){
        console.log(error)
      }
      else{
        res.render('admin/add-product')
      }
    })
  })
  
})

module.exports = router;
