const { promisify } = require('util')
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




// protect
exports.protect = catchAsync(async (req, res, next) => {

    // check if token exists
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    if (!token) return next(new AppError('Token does not exist! Please log in again', 401))


    // verify 
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)


    // check if user still exists
    const currentUser = await UserModel.findById(decoded.id)
    if (!currentUser) return next(new AppError('The user belonging to this token does no longer exist.', 401))


    // check if user changed his password after token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again.', 401))
    }

    req.user = currentUser
    next()
})




// restrict to
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have the permission to perform this action', 403))
        }

        next()
    }
}