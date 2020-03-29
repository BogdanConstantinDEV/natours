const express = require('express')
const tourController = require('../controllers/tourController')
const authController = require('../controllers/authController')
const reviewRouter = require('./reviewRouter')


const router = express.Router()
router.use('/:tourId/reviews', reviewRouter)






// top five tours
router.route('/top-five-tours')
    .get(tourController.topFiveTours, tourController.getAllTours)

// tour stats
router.route('/tour-stats')
    .get(tourController.getTourStats)

// monthly plan
router.route('/monthly-plan/:year')
    .get(
        authController.protect,
        authController.restrictTo('guide', 'lead-guide', 'admin'),
        tourController.getMonthlyPlan)




// get tours within radius
router.get('/tours-within/:distance/center/:latlng/unit/:unit',
    tourController.getToursWithin
)

// get distances to tours
router.get('/distances/:latlng/unit/:unit', tourController.getDistance)




router.route('/')
    .get(tourController.getAllTours)
    .post(
        authController.protect,
        authController.restrictTo('lead-guide', 'admin'),
        tourController.createTour)

router.route('/:id')
    .get(tourController.getTour)
    .patch(
        authController.protect,
        authController.restrictTo('lead-guide', 'admin'),
        tourController.updateTour
    )
    .delete(
        authController.protect,
        authController.restrictTo('lead-guide', 'admin'),
        tourController.deleteTour
    )

module.exports = router