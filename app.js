const express = require('express')
const tourRouter = require('./routes/tourRoutes')

const app = express()

// middleware
app.use(express.json())

// routes
app.use('/api/v1/tours', tourRouter)

module.exports = app