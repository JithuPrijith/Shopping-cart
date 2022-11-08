const userData = require('../models/user-signup');
const bcrypt = require('bcrypt');


module.exports = {
    doSignUp: async (req, res) => {
        try {
            const userExist = await userData.findOne({ userEmail: req.body.userEmail })
            if (userExist) {
                req.session.loginErr = "username or email already exist";
                console.log("username or email already exist");
                res.render('user/sign-in');
            }
            else {
                return new Promise(async (resolve, reject) => {
                    req.body.userPassword = await bcrypt.hash(req.body.userPassword, 10)
                    await new userData(req.body).save()
                        .then((data) => {
                            resolve(data)
                        })
                })
            }


        } catch (error) {
            console.log("catch", error)
        }
    },

    verifyUser: (req, res, next) => {
        console.log("hereee");
        console.log(req.session.loggedIn);
        if (req.session.loggedIn) {
             next();
        }
        else {
            res.redirect('/login')
            console.log("vannu2");
        }
    },

}


