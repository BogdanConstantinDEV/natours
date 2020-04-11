const crypto = require('crypto')
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

// create and send token function
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id)

    // send token via cookie
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    // remove password from the layout
    user.password = undefined

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true
    res.cookie('jwt', token, cookieOptions)

    res.status(statusCode).json({
        status: 'success',
        token,
        data: user
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

    createSendToken(user, 201, res)
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

    createSendToken(user, 200, res)
})




// log out
exports.logout = (req, res) => {
    res.cookie('jwt', 'logged out', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })
    res.status(200).json({ status: 'success' })
}





// protect
exports.protect = catchAsync(async (req, res, next) => {

    // check if token exists
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies.jwt) token = req.cookies.jwt
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
    res.locals.user = currentUser
    req.user = currentUser
    next()
})


// check if user is logged in
exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {

        try {
            // verify token 
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)

            // check if user still exists
            const currentUser = await UserModel.findById(decoded.id)
            if (!currentUser) return next()

            // check if user changed his password after token was issued
            if (currentUser.changedPasswordAfter(decoded.iat)) return next()

            res.locals.user = currentUser
            return next()
        }
        catch (err) {
            return next()
        }
    }
    next()
}


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

    // find the user based on email token
    const hashedPassword = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex')
    const user = await UserModel.findOne({
        passwordResetToken: hashedPassword,
        passwordResetExpires: { $gt: Date.now() }
    })
    if (!user) return next(new AppError('Token is invalid or has expired', 400))

    // change password in DB
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()

    // log user in (return token)
    createSendToken(user, 200, res)
})




// update password
exports.updatePassword = catchAsync(async (req, res, next) => {

    // find user based on login token
    const user = await UserModel.findById(req.user._id).select('+password')

    // check if passwordsmatch
    if (!(await user.correctPassword(req.body.oldPassword, user.password))) {
        return next(new AppError('Password you entered is not valid', 400))
    }

    // update password in DB
    user.password = req.body.newPassword
    user.passwordConfirm = req.body.newPasswordConfirm
    await user.save()

    // log user in (return token)
    createSendToken(user, 200, res)

})