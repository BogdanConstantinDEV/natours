const express = require('express')

const userController = require('./../controllers/userController')
const authController = require('../controllers/authController')


const router = express.Router()





// sign up/log-in/log-out
router.post('/signup', authController.signUp)
router.post('/login', authController.login)
router.get('/logout', authController.logout)

// forgot/restart password
router.post('/forgot-password', authController.forgotPassword)
router.patch('/reset-password/:token', authController.resetPassword)








// PROTECT all routes bellow this middleware
router.use(authController.protect)


// update current user data
router.patch('/update-me',
    userController.uploadUserPhoto,
    userController.resizePhoto,
    userController.updateMe
)

// update current user password
router.patch('/update-my-password', authController.updatePassword)

// get current user
router.get('/me', userController.getMe, userController.getUser)

// delete current user
router.delete('/delete-me', userController.deleteMe
)



// RESTRICT all routes bellow this middleware to admin
router.use(authController.restrictTo('admin'))


router.route('/')
    .get(userController.getAllUsers)

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

module.exports = router