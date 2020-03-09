const express = require('express')

const userController = require('./../controllers/userController')
const authController = require('../controllers/authController')


const router = express.Router()

// sign up/log-in/update-my-password
router.post('/signup', authController.signUp)
router.post('/login', authController.login)

// forgot/restart/update password
router.post('/forgot-password', authController.forgotPassword)
router.patch('/reset-password/:token', authController.resetPassword)
router.patch('/update-my-password',
    authController.protect,
    authController.updatePassword
)



// update user data
router.patch('/update-me',
    authController.protect,
    userController.updateMe
)
// delete current user
router.delete('/delete-me',
    authController.protect,
    userController.deleteMe
)




router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser)

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

module.exports = router