const express = require('express')
const viewsController = require('../controllers/viewsController')
const authController = require('../controllers/authController')

const router = express.Router()


router.get('/', authController.isLoggedIn, viewsController.getOverview)
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getOneTour)
router.get('/login', authController.isLoggedIn, viewsController.getLogin)
router.get('/my-account', authController.protect, viewsController.getMyAccount)
router.get('/signup', authController.isLoggedIn, viewsController.getSignup)


module.exports = router