var express = require('express');
const { checkSchema } = require('express-validator');
var router = express.Router();
var adminHelpers = require('../controllers/admin-helpers')
var {confirmPassword, userValidation} = require('../controllers/user-helpers');
const { validate } = require('../models/add-product');

/*******************************************************   user home page  ******************************************************************************/
router.get('/', function (req, res, next) {
  adminHelpers.getAllProducts((products) => {
    res.render('user/display', {admin:false,products });
  })
  
});

/*******************************************************   sign in page   ******************************************************************************/
router.get('/signIn', (req,res) =>  res.render('user/sign-in') );

/*******************************************************   sign up page  ******************************************************************************/
router.get('/signUp', (req,res) =>  res.render('user/sign-up') );

/*******************************************************   sign up post request ******************************************************************************/
router.post('/signup',confirmPassword(),userValidation);



module.exports = router;