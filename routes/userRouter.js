const express = require('express')

const userController = require('./../controllers/userController')
const authController = require('../controllers/authController')


const router = express.Router()

// sign up & log in
router.post('/signup', authController.signUp)
router.post('/login', authController.login)

// forgot/restart/update password
router.post('/forgot-password', authController.forgotPassword)
router.patch('/reset-password/:token', authController.resetPassword)
router.patch('/update-password',
    authController.protect,
    authController.updatePassword
)




router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser)

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

module.exports = router