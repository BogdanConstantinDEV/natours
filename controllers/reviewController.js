const ReviewModel = require('../models/reviewModel')
const AppError = require('../util/appError')
const catchAsync = require('../util/catchAsync')




// get all reviews
exports.getAllReviews = catchAsync(async (req, res, next) => {

    const reviews = await ReviewModel.find()

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: { reviews }
    })
})




// create review
exports.createReview = catchAsync(async (req, res, next) => {

    if (!req.body.tour) req.body.tour = req.params.tourId
    if (!req.body.user) req.body.user = req.user._id
    const review = await ReviewModel.create(req.body)

    res.status(201).json({
        status: 'success',
        data: { review }
    })
})




// get specific review
exports.getReview = catchAsync(async (req, res, next) => {
    const review = await ReviewModel.findById(req.params.id)

    res.status(200).json({
        status: 'success',
        data: { review }
    })
})