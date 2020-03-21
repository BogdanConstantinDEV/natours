const express = require('express')
const reviewController = require('../controllers/reviewController')
const authController = require('../controllers/authController')

const router = express.Router({ mergeParams: true })






// PROTECT all routes bellow this middleware
router.use(authController.protect)


router.route('/')
    .get(
        authController.restrictTo('admin'),
        reviewController.getAllReviews)
    .post(
        authController.restrictTo('user'),
        reviewController.createReview
    )


router.route('/:id')
    .get(
        reviewController.setTourUserIds,
        reviewController.getReview
    )
    .patch(
        authController.restrictTo('user', 'admin'),
        reviewController.updateReview
    )
    .delete(
        authController.restrictTo('user', 'admin'),
        reviewController.deleteReview
    )




module.exports = router