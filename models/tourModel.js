const mongoose = require('mongoose')

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'tour must have a name'],
            unique: true,
            trim: true
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
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7
})
tourSchema.virtual('priceRON').get(function () {
    return `${this.price * 4.4} RON`
})


const Tour = new mongoose.model('Tour', tourSchema)

module.exports = Tour