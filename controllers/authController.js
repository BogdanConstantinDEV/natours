const UserModel = require('../models/userModel')
const catchAsync = require('../util/catchAsync')

// sign up
exports.signUp = catchAsync(async (req, res) => {
    const user = await UserModel.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    })
    res.status(201).json({
        status: 'success',
        data: {
            user
        }
    })
})