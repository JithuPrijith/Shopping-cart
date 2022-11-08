const userData = require("../models/user-signup")

module.exports = {
    saveAddress :(addressData,userId) => {
        try {
            return new Promise(async (resolve, reject) => {
                await userData.findOneAndUpdate({ '_id': userId },
                    {
                        $push: { 'address': addressData.deliveryDetails }
                    },
                    {
                        new:true
                    }).then((data) =>{
                        console.log(data);
                        resolve(data.address)
                    })
            })
        } catch (error) {
            
        }
    },
    getAddress:async (reqUserId) => {
        return new Promise(async (resolve, reject) => {
            await userData.findOne({ userId :reqUserId}).then((data) => {
                resolve(data.address)
                console.log(data);
            })
        })
       
    }
}