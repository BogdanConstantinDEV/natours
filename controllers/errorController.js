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

// handle web token error
const handleWebTokenError = () => {
    return new AppError('Invalid Web Token', 401)
}

// handle token expired error
const handleTokenExpiredError = () => {
    return new AppError('Token has expired! Please log in again', 401)
}









const sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            error: err,
            stack: err.stack
        })
    }
    return res.status(err.statusCode).render('error', {
        title: 'Error 😟',
        errorMessage: err.message
    })
}
const sendErrorProd = (err, req, res) => {

    if (req.originalUrl.startsWith('/api')) {
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            })
        }
        console.error('ERROR💥', err)
        res.status(500).json({
            status: 'error',
            message: 'something very bad happened'
        })
    }

    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
            title: 'Error 😟',
            errorMessage: err.message
        })
    }

    console.error('ERROR💥', err)
    res.status(500).render('error', {
        title: 'Error 😟',
        errorMessage: 'Something bad happened! Try again later'
    })
}










module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res)
    }
    else if (process.env.NODE_ENV === 'production') {
        let error = { ...err }
        error.message = err.message

        // wrong db id
        if (error.name === 'CastError') error = handleCastError(error)

        // duplicate key error
        if (error.code === 11000) error = handleDuplicateError(error)

        // valuidation error
        if (error.name === 'ValidationError') error = handleValidationError(error)

        // invalid web token
        if (error.name === 'JsonWebTokenError') error = handleWebTokenError()

        // token expired error
        if (error.name === 'TokenExpiredError') error = handleTokenExpiredError()

        sendErrorProd(error, req, res)
    }
}