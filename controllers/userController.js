const User = require('../models/userModel')
const catchAsync = require('../util/catchAsync')
const AppError = require('../util/appError')
const factory = require('./handlerFactory')




exports.getAllUsers = factory.getAll(User)
exports.getUser = factory.getOne(User)
exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)





// filter body object
const filterObj = (obj, ...allowedFields) => {
    const newObj = {}
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el]
    })

    return newObj
}






// get current user
exports.getMe = (req, res, next) => {
    req.params.id = req.user._id
    next()
}









// update current user
exports.updateMe = catchAsync(async (req, res, next) => {

    // check if user is trying to update password
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('You are not allowed to update your password! If you want to update your password, do it here /update-my-password 😉', 400))
    }

    // update user data
    const filteredBody = filterObj(req.body, 'name', 'email')
    const user = await User.findByIdAndUpdate(req.user._id, filteredBody, {
        new: true,
        runValidators: true
    })

    // return new user
    res.status(200).json({
        status: 'success',
        data: user
    })
})





// delete current user
exports.deleteMe = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id, { active: false })

    res.status(200).json({
        status: 'success',
        data: { user }
    })
})


