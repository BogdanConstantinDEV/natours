const express = require('express')
const tourController = require('../controllers/tourController')
const authController = require('../controllers/authController')


const router = express.Router()

// top five tours
router.route('/top-five-tours')
    .get(tourController.topFiveTours, tourController.getAllTours)

// tour stats
router.route('/tour-stats')
    .get(tourController.getTourStats)

// monthly plan
router.route('/monthly-plan/:year')
    .get(tourController.getMonthlyPlan)







router.route('/')
    .get(authController.protect, tourController.getAllTours)
    .post(tourController.createTour)

router.route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour)

module.exports = router