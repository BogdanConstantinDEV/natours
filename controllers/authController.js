const UserModel = require('../models/userModel')
const catchAsync = require('../util/catchAsync')
const jwt = require('jsonwebtoken')

// sign up
exports.signUp = catchAsync(async (req, res) => {
    const user = await UserModel.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
})