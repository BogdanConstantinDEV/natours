const mongoose = require('mongoose')

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
            enum: {
                values: [1, 2, 3, 4, 5],
                message: 'Rating must be between 1 and 5'
            }
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

const Review = new mongoose.model('Review', reviewSchema)
module.exports = Review