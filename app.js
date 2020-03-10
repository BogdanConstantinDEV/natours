const express = require('express')
const rateLimit = require('express-rate-limit')
const tourRouter = require('./routes/tourRouter')
const userRouter = require('./routes/userRouter')
const globalErrorHandler = require('./controllers/errorController')
const AppError = require('./util/appError')

const app = express()

// GLOBAL MIDDLEWARE
app.use(express.json())

// rate limit middleware
const limit = rateLimit({
    max: 150,
    windowMs: 60 * 60 * 1000,
    message: 'To many requests from this ip! Try again in one hour. 😉'
})
app.use('/api', limit)





// routes
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)


// error function for unknown requests
app.all('*', (req, res, next) => {
    next(new AppError(`Can't access ${req.originalUrl} on this server`, 404))
})


// error middleware
app.use(globalErrorHandler)




module.exports = app