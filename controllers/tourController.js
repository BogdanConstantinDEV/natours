const Tour = require('../models/tourModel')
const APIFeatures = require('../util/apiFeatures')


// top 5 tours
exports.topFiveTours = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingsAverage,difficulty,summary'
    next()
}


// query all tours
exports.getAllTours = async (req, res) => {
    try {

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
    }
    catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}



// create a tour
exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body)
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    }
    catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}



// get a tour
exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id)
        res.status(200).json({
            status: 'success',
            data: {
                tour: tour
            }
        })
    }
    catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}



// update tour
exports.updateTour = async (req, res) => {
    try {
        const upTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status: 'success',
            data: {
                tour: upTour
            }
        })
    }
    catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}



// delete tour
exports.deleteTour = async (req, res) => {
    try {
        const delTour = await Tour.findByIdAndDelete(req.params.id)
        res.status(200).json({
            status: 'success',
            data: {
                status: 'success',
                data: null
            }
        })
    }
    catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}



// get tour stats 
exports.getTourStats = async (req, res) => {
    try {
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
    }
    catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}