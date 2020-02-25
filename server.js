const dotenv = require('dotenv')
const mongoose = require('mongoose')
dotenv.config({ path: './config.env' })

// handle any uncaught errors
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION 💥 Shutting down...')
    console.log(err.name, err.message)
    process.exit(1)
})

const app = require('./app')


// connect to DB
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
mongoose
    .connect(DB, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('DB connected'))


// connect to server
const server = app.listen(6000, '127.0.0.1', () => {
    console.log('server running on port 6000')
})



process.on('unhandledRejection', err => {
    console.log(err.name, err.message)
    console.log('UNHANDLED REJECTION  💥  Shutting down...')
    server.close(() => process.exit(1))
})
