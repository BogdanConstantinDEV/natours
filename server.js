const dotenv = require('dotenv')
const mongoose = require('mongoose')
dotenv.config({ path: './config.env' })
const app = require('./app')


const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose
    .connect(DB, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('DB connected'))

app.listen(6000, '127.0.0.1', () => {
    console.log('server running on port 6000')
})