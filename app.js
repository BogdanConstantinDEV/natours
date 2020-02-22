const express = require('express')
const tourRouter = require('./routes/tourRoutes')

const app = express()

// middleware
app.use(express.json())

// routes
app.use('/api/v1/tours', tourRouter)


// fail route
app.use('*', (req, res, next) => {
    const err = new Error(`Can't find anything at ${req.originalUrl}`)
    err.statusCode = 404
    err.status = 'fail'

    next(err)
})


// fail middleware
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'fail'

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
})


module.exports = app