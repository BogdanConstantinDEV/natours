const User = require('../models/userModel')
const catchAsync = require('../util/catchAsync')
const AppError = require('../util/appError')
const factory = require('./handlerFactory')




// filter body object
const filterObj = (obj, ...allowedFields) => {
    const newObj = {}
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el]
    })

    return newObj
}






exports.getAllUsers = factory.getAll(User)
exports.deleteMe = factory.deleteOne()
exports.getUser = factory.getOne(User)
exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)





// update user data
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









exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}