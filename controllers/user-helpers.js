const { body, validationResult, check } = require('express-validator')

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

    userValidation: (req, res) => {
        const errors = validationResult(req);
        console.log(req.body);

        if (!errors.isEmpty()) {
            return res.status(422).jsonp(errors.array());

        } else {
            res.send("success");
        }
    }
}