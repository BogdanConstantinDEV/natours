const AppError = require('../util/appError')


// handle wrong DB id error
const handleCastError = err => {
    return new AppError(`Invalid ${err.path}: ${err.value}💥`, 400)
}

// handle duplicate key error
const handleDuplicateError = err => {
    const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0]
    return new AppError(`Duplicate field value: ${value}😉`, 400)
}

// handle validation error
const handleValidationError = err => {
    const errorMessages = Object.values(err.errors).map(el => el.message)
    return new AppError(`Invalid fields: ${errorMessages.join(' 👀  ')}`, 400)
}

// 
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    })
}
const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    } else {
        console.error('ERROR💥', err)
        res.status(500).json({
            status: 'error',
            message: 'something very bad happened'
        })
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res)
    }
    else if (process.env.NODE_ENV === 'production') {
        let error = { ...err }

        // wrong db id
        if (error.name === 'CastError') error = handleCastError(error)

        // duplicate key error
        if (error.code === 11000) error = handleDuplicateError(error)

        // valuidation error
        if (error.name = 'ValidationError') error = handleValidationError(error)

        sendErrorProd(error, res)
    }
}