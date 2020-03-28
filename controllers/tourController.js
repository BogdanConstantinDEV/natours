const Tour = require('../models/tourModel')
const catchAsync = require('../util/catchAsync')
const factory = require('./handlerFactory')
const AppError = require('../util/appError')


exports.getAllTours = factory.getAll(Tour)
exports.createTour = factory.createOne(Tour)
exports.getTour = factory.getOne(Tour, { path: 'reviews' })
exports.updateTour = factory.updateOne(Tour)
exports.deleteTour = factory.deleteOne(Tour)




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



// get tours within distance
exports.getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params
    const [lat, lng] = latlng.split(', ')
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1

    if (!lat || !lng) return next(new AppError('No latidute or longitude specified', 400))

    const tours = await Tour.find(
        { startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } } }
    )

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: { tours }
    })
})