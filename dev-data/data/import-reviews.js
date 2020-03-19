const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const ReviewModel = require('../../models/reviewModel')

dotenv.config({ path: './config.env' })


// get all reviews
const allReviews = fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')




// connect to DB
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
mongoose
    .connect(DB, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('DB connected'))









const importReviews = async () => {
    try {
        await ReviewModel.create(JSON.parse(allReviews))
        console.log('Reviews imported')
    }
    catch (err) {
        console.log(err)
    }
    process.exit()
}

const deleteReviews = async () => {
    try {
        await ReviewModel.deleteMany()
        console.log('Reviews deleted')
    }
    catch (err) {
        console.log(err)
    }
    process.exit()
}






if (process.argv[2] === '--import') {
    importReviews()
} else if (process.argv[2] === '--delete') {
    deleteReviews()
}