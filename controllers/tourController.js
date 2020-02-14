const Tour = require('../models/tourModel')



// get all tours queryed
exports.getAllTours = async (req, res) => {
    try {

        // build query
        const queryObj = { ...req.query }
        const excludedFields = ['page', 'sort', 'fields', 'limit']
        excludedFields.forEach(el => delete queryObj[el])
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`)
        const query = Tour.find(JSON.parse(queryStr))

        // execute query
        const qTours = await query

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