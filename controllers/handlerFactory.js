const catchAsync = require('../util/catchAsync')
const AppError = require('../util/appError')
const APIFeatures = require('../util/apiFeatures')



// get all
exports.getAll = Model => catchAsync(async (req, res, next) => {
    let filter = {}
    if (req.params.tourId) filter = { tour: req.params.tourId }

    const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()
    const doc = await features.query

    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: { doc }
    })
})






// create one
exports.createOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body)

    res.status(201).json({
        status: 'success',
        data: { doc }
    })
})




// get one
exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id)
    if (popOptions) query = query.populate(popOptions)
    const doc = await query
    if (!doc) return next(new AppError(`Can't find any document with this ID`, 404))

    res.status(200).json({
        status: 'success',
        data: { doc }
    })
})





// update one
exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    if (!doc) return next(new AppError(`Can't find any document with this ID`, 404))

    res.status(200).json({
        status: 'success',
        data: { doc }
    })
})





// delete one
exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)
    if (!doc) return next(new AppError(`Can't find any document with this ID ${req.params.id}`, 404))

    res.status(204).json({
        status: 'success',
        data: null
    })
})