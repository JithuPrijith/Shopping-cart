const { body, validationResult, check } = require('express-validator');
const userServices = require('../services/user')

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
            return res.status(422).json(errors.array());
            
        }
        else {
            userServices.doSignUp(req.body).then((data) => {
                res.render('user/sign-up', {message : "Registration successful"})
            })
           
           
        } 
        
    },
    
}