const Tour = require('../models/tourModel')
const APIFeatures = require('../util/apiFeatures')
const catchAsync = require('../util/catchAsync')
const AppError = require('../util/appError')



// query all tours
exports.getAllTours = catchAsync(async (req, res, next) => {

    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()
    const qTours = await features.query

    res.status(200).json({
        status: 'success',
        results: qTours.length,
        data: {
            tours: qTours
        }
    })
})




// create a tour
exports.createTour = catchAsync(async (req, res, next) => {

    const newTour = await Tour.create(req.body)
    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        }
    })
})




// get a tour
exports.getTour = catchAsync(async (req, res, next) => {

    const tour = await Tour.findById(req.params.id)

    if (!tour) return next(new AppError(`Can't find any tour with this ID`, 404))

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    })
})



// update tour
exports.updateTour = catchAsync(async (req, res, next) => {

    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!tour) return next(new AppError(`Can't find any tour with this ID`, 404))

    res.status(200).json({
        status: 'success',
        data: {
            tour: tour
        }
    })
})




// delete tour
exports.deleteTour = catchAsync(async (req, res, next) => {

    const tour = await Tour.findByIdAndDelete(req.params.id)

    if (!tour) return next(new AppError(`Can't find any tour with this ID ${req.params.id}`, 404))

    res.status(204).json({
        status: 'success',
        data: {
            status: 'success',
            data: null
        }
    })
})




// top 5 tours
exports.topFiveTours = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingsAverage,difficulty,summary'
    next()
}




// get tour stats 
exports.getTourStats = catchAsync(async (req, res, next) => {

    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                numRatings: { $sum: '$ratingsQuantity' }
            }
        },
        {
            $sort: { avgPrice: 1 }
        }
    ])

    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    })
})




// get monthly plan
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {

    const year = req.params.year * 1
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        }, {
            $group: {
                _id: { $month: '$startDates' },
                numTours: { $sum: 1 },
                name: { $push: '$name' }
            }
        },
        {
            $sort: { numTours: -1 }
        },
        {
            $addFields: { month: `$_id` }
        },
        {
            $project: { _id: 0 }
        },
        {
            $limit: 6
        }
    ])

    res.status(200).json({
        status: 'success',
        data: {
            plan
        }
    })
})