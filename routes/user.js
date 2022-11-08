const { json } = require('body-parser');
var express = require('express');
const { checkSchema } = require('express-validator');
var router = express.Router();
var adminHelpers = require('../controllers/admin-helpers')

var { confirmPassword,
   userValidation,
   doSignin,
   doLogout,
   addToCart,
   cartController,
   cartQuantityController,
   cartRemoveController,
   placeOrderController,
   saveAddressController,
   paymentController } = require('../controllers/user-helpers');

const { validate } = require('../models/add-product');
const { verifyUser,  userDataOnDb } = require('../services/user');
const { cartCount } = require('../services/product')

/*******************************************************   user home page  ******************************************************************************/
router.get('/', function (req, res, next) {
  let user = req.session.user;
  adminHelpers.getAllProducts(async(products) => {
    if(user){
      let cartcount = await cartCount(req.session.user._id)
      res.render('user/user-banner', { admin: false, products, user, cartcount });
    }
    else{
      res.render('user/user-banner', { admin: false, products });
    }
   
  })

});

/* ----------------------------------- sign in page  -----------------------------------*/

router.get('/login', (req, res) => {
  if(req.session.loggedIn){
    res.redirect('/')
  }
  else{
    res.render('user/sign-in',{"loginErr" : false})
  }
});
  

/* ------------------------------------- sign up page ----------------------------------*/

router.get('/signup', (req, res) => res.render('user/sign-up'));

/* ---------------------------------- sign up post request -----------------------------*/

router.post('/signup', confirmPassword(), userValidation);

/* ---------------------------------- sign in post request -----------------------------*/
router.post('/login', doSignin);

/* ---------------------------------- sign in post request -----------------------------*/
router.get('/logout', doLogout)

/* ---------------------------------- cart get page request -----------------------------*/
router.get('/cart',verifyUser,cartController);

/* ---------------------------------- cart get page request -----------------------------*/
router.get('/add-to-cart/:id',verifyUser,addToCart)

/* ---------------------------------- cart post change quantity -----------------------------*/
router.post('/change-quantity',verifyUser,cartQuantityController)

/* ---------------------------------- cart remove button get -----------------------------*/
router.get('/remove-from-cart/:id',cartRemoveController)

/* ---------------------------------- cart remove button get -----------------------------*/
router.get('/place-order',verifyUser, placeOrderController)

/* ---------------------------------- save address post -----------------------------*/
router.post('/save-address',verifyUser,saveAddressController)

/* ---------------------------------- save address post -----------------------------*/
router.get('/proceed-payment',verifyUser,paymentController)

module.exports = router;