const catchAsync = require('../util/catchAsync')
const AppError = require('../util/appError')




exports.deleteOne = Model => catchAsync(async (req, res, next) => {

    const doc = await Model.findByIdAndDelete(req.params.id)

    if (!doc) return next(new AppError(`Can't find any document with this ID ${req.params.id}`, 404))

    res.status(204).json({
        status: 'success',
        data: {
            status: 'success',
            data: null
        }
    })
})