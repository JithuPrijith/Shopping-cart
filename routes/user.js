const { json } = require('body-parser');
var express = require('express');
const { checkSchema } = require('express-validator');
var router = express.Router();
var adminHelpers = require('../controllers/admin-helpers')
var { confirmPassword, userValidation, doSignin, doLogout, cart } = require('../controllers/user-helpers');
const { validate } = require('../models/add-product');
const { verifyUser } = require('../services/user');

/*******************************************************   user home page  ******************************************************************************/
router.get('/', function (req, res, next) {
  let user = req.session.user;
  adminHelpers.getAllProducts((products) => {
    res.render('user/display', { admin: false, products, user });
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
router.get('/cart',verifyUser,cart)




module.exports = router;