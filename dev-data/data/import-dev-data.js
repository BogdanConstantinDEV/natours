const mongoose = require('mongoose')
const fs = require('fs')
const dotenv = require('dotenv')
const TourModel = require('../../models/tourModel')

dotenv.config({ path: './config.env' })

const allTours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'))







// connect to db
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
mongoose
    .connect(DB, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('DB connected'))






// import/delete functions
const importData = async () => {
    try {
        await TourModel.create(allTours)
        console.log('data imported')
    }
    catch (err) {
        console.log(err)
    }
    process.exit()
}
const deleteData = async () => {
    try {
        await TourModel.deleteMany()
        console.log('data deleted')
    }
    catch (err) {
        console.log(err)
    }
    process.exit()
}
if (process.argv[2] === '--import') {
    importData()
} else if (process.argv[2] === '--delete') {
    deleteData()
}