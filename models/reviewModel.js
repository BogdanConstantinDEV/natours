const mongoose = require('mongoose')
const Tour = require('./tourModel')

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, 'Review must not be empty'],
            minlength: [4, 'Review length must be >= 4'],
            maxlength: [500, 'Review length must be <= 500']
        },
        rating: {
            type: Number,
            required: [true, 'Review must have a rating'],
            min: [1, 'Rating must be >= 1'],
            max: [5, 'Rating must be <= 5']
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            required: [true, 'Review must belong to a tour']
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to a user']
        }
    },
    {
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }
)



// << QUERY MIDDLEWARE >>
reviewSchema.pre(/^find/, function (next) {
    this.populate({ path: 'user', select: 'name photo' })
    next()
})






// calculate and set ratings average on tour
reviewSchema.statics.calcAverageRatings = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                sumRatings: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ])

    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId,
            {
                ratingsAverage: stats[0].avgRating,
                ratingsQuantity: stats[0].sumRatings
            })
    } else {
        await Tour.findByIdAndUpdate(tourId,
            {
                ratingsAverage: 4.5,
                ratingsQuantity: 0
            })
    }
}

reviewSchema.post('save', function () {
    this.constructor.calcAverageRatings(this.tour)
})


// update tour rating when delete/update review
reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne()
    next()
})
reviewSchema.post(/^findOneAnd/, function () {
    this.r.constructor.calcAverageRatings(this.r.tour)
})









const Review = new mongoose.model('Review', reviewSchema)
module.exports = Review