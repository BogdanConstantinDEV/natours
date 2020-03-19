const mongoose = require('mongoose')
const slugify = require('slugify')

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'tour must have a name'],
            unique: true,
            trim: true,
            maxlength: [40, 'name length must be <= 40'],
            minlength: [10, 'name lenght must be >= 10']

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
        difficulty: {
            type: String,
            required: [true, 'tour must have a difficulty'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'difficulty must be : easy, medium or difficult'
            }
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'rating must be >= 1'],
            max: [5, 'rating must be <= 5']
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },

        price: {
            type: Number,
            required: [true, 'tour must have a price']
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (val) {
                    return val < this.price
                }
            },
            message: 'priceDiscount must be lower then regular price'
        },
        summary: {
            type: String,
            required: [true, 'tour must have a summary'],
            trim: true,
            maxlength: [200, 'summary length must be <= 200']
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
        },
        startLocation: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String
        },
        locations: [
            {
                type: {
                    type: String,
                    default: 'Point',
                    enum: ['Point']
                },
                coordinates: [Number],
                address: String,
                description: String,
                day: Number
            }
        ],
        guides: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            }
        ]
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

// virtual populate reviews
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
})





// << DOCUMENT MIDDLEWARE >>

tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true })
    next()
})




// << QUERY MIDDLEWARE >>

tourSchema.pre(/^find/, function (next) {
    this.start = Date.now()
    next()
})

tourSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt'
    })

    next()
})


tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
    next()
})

const Tour = new mongoose.model('Tour', tourSchema)

module.exports = Tour