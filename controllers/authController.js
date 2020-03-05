const { promisify } = require('util')
const UserModel = require('../models/userModel')
const catchAsync = require('../util/catchAsync')
const jwt = require('jsonwebtoken')
const AppError = require('../util/appError')
const sendEmail = require('../util/email')





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





// forgot password
exports.forgotPassword = catchAsync(async (req, res, next) => {

    // check if user exists in DB based on POSTed mail
    const user = await UserModel.findOne({ email: req.body.email })
    if (!user) return next(new AppError('There is no user with this email', 404))

    // create a reset token
    const resetToken = user.createResetPasswordToken()
    await user.save({ validateBeforeSave: false })

    // sending the email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/forgot-password/${resetToken}`
    const message = `Did you forgot your password?\nIf you did, send a PATCH request on this link ${resetURL}.\nIf you did not forgot your password, simply ignore this email 😃`
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token ( valid for 10 minutes )',
            message
        })
        res.status(200).json({
            status: 'success',
            message: 'Email delivered with success 😉'
        })
    }
    catch (err) {
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save({ validateBeforeSave: false })

        return next(new AppError('There was and error sending the email! Try again later', 500))
    }
})





// reset password
exports.resetPassword = catchAsync(async (req, res, next) => {

})