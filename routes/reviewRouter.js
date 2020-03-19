const express = require('express')
const reviewController = require('../controllers/reviewController')

const router = express.Router()



router.route('/')
    .get(reviewController.getAllReviews)
    .post(reviewController.createReview)


router.route('/:id')
    .get(reviewController.getReview)




module.exports = router