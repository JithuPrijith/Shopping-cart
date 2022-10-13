var express = require('express')
const { body, validationResult, check } = require('express-validator');
const { doSignUp, verifyUser } = require('../services/user')
const userData = require('../models/user-signup')
const bcrypt = require('bcrypt')

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
            return res.render('user/sign-up', { errors })

        }
        else {
            doSignUp(req,res).then((data) => {
                req.session.loggedIn = true;
                req.session.user = req.body;
                res.redirect('/');
            })


        }

    },

    doSignin: (req, res) => {
        try {
            return new Promise(async (resolve, reject) => {

                let user = await userData.findOne({ userEmail: req.body.loginEmail })
                if (user) {
                    bcrypt.compare(req.body.loginPassword, user.userPassword).then((status) => {
                        if (status) {
                            req.session.loggedIn = true;
                            req.session.user = user;
                            res.redirect('/');
                        }
                        else {
                            resolve({ status: false })
                            req.session.loginErr = "incorrect password";
                            res.render('user/sign-in', { "loginErr": req.session.loginErr })
                            req.session.loginErr = null;
                        }
                    })
                }
                else {
                    resolve({ status: false })
                    req.session.loginErr = "incorrect email";
                    res.render('user/sign-in', { "loginErr": req.session.loginErr })
                    req.session.loginErr = null;
                }

            })


        } catch (error) {
            console.log("ok", error);
        }
    },

    doLogout: (req, res) => {
        req.session.destroy();
        res.redirect('/');
    },

    cart: (req, res) => {
        try {
            res.render('user/cart')

        } catch (error) {

        }

    }



}