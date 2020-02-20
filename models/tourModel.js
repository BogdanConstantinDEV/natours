const mongoose = require('mongoose')
const slugify = require('slugify')

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'tour must have a name'],
            unique: true,
            trim: true
        },
        slug: {
            type: String
        },
        duration: {
            type: Number,
            required: [true, 'tour must have a duration']
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'tour must have a group size']
        },
        difficulty: String,
        ratingsAverage: {
            type: Number,
            default: 4.5
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },

        price: {
            type: Number,
            required: [true, 'tour must have a price']
        },
        priceDiscount: Number,
        summary: {
            type: String,
            required: [true, 'tour must have a summary'],
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        imageCover: {
            type: String,
            required: [true, 'tour must have a image cover']
        },
        images: {
            type: [String]
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        startDates: {
            type: [Date]
        },
        secretTour: {
            type: Boolean,
            default: false
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

// virtual porperties
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7
})
tourSchema.virtual('priceRON').get(function () {
    return `${this.price * 4.4} RON`
})

// document middleware
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true })
    next()
})

// query middleware
tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } })
    this.start = Date.now()
    next()
})
tourSchema.post(/^find/, function (docs, next) {
    console.log(`query completed in ${Date.now() - this.start} miliseconds`)
    next()
})

// aggregation middleware
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
    next()
})

const Tour = new mongoose.model('Tour', tourSchema)

module.exports = Tour