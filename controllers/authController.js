const UserModel = require('../models/userModel')
const catchAsync = require('../util/catchAsync')
const jwt = require('jsonwebtoken')
const AppError = require('../util/appError')

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

// sign up
exports.signUp = catchAsync(async (req, res) => {

    const user = await UserModel.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    })

    const token = signToken(user._id)
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user
        }
    })
})




// log in
exports.login = catchAsync(async (req, res, next) => {

    const { email, password } = req.body
    // check if entered email and password
    if (!email || !password) return next(new AppError('Enter your email and password', 400))


    const user = await UserModel.findOne({ email }).select('+password')
    // check if user exists and passwords match
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Invalid email or password', 401))
    }

    const token = signToken(user._id)
    res.status(200).json({
        status: 'success',
        token
    })
})