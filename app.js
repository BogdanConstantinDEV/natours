const express = require('express')
const tourRouter = require('./routes/tourRouter')
const userRouter = require('./routes/userRouter')
const globalErrorHandler = require('./controllers/errorController')
const AppError = require('./util/appError')

const app = express()

// middleware
app.use(express.json())

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