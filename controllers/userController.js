const UserModel = require('../models/userModel')
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






// get all users
exports.getAllUsers = catchAsync(async (req, res, next) => {

    const users = await UserModel.find()

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: users
    })
})





// update user data
exports.updateMe = catchAsync(async (req, res, next) => {

    // check if user is trying to update password
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('You are not allowed to update your password! If you want to update your password, do it here /update-my-password 😉', 400))
    }

    // update user data
    const filteredBody = filterObj(req.body, 'name', 'email')
    const user = await UserModel.findByIdAndUpdate(req.user._id, filteredBody, {
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
    await UserModel.findByIdAndUpdate(req.user._id, { active: false })

    res.status(204).json({
        status: 'success',
        data: null
    })
})






exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}
exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}
exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
}
exports.deleteUser = factory.deleteOne(UserModel)