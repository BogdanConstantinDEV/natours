const UserModel = require('../models/userModel')
const catchAsync = require('../util/catchAsync')

// sign up
exports.signUp = catchAsync(async (req, res) => {
    const user = await UserModel.create(req.body)
    res.status(201).json({
        status: 'success',
        data: {
            user
        }
    })
})