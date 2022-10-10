const userData = require('../models/user-signup');
const bcrypt = require('bcrypt');


module.exports = {
    doSignUp: (userDetails) => {
        try {
            return new Promise(async (resolve, reject) => {
                userDetails.userPassword = await bcrypt.hash(userDetails.userPassword, 10)
                await new userData(userDetails).save()
                    .then((data) => {
                        resolve(data)

                    })
            })

        } catch (error) {
            console.log(error)
        }
    },



}


