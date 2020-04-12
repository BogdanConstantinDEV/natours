const catchAsync = require('../util/catchAsync')
const Tour = require('../models/tourModel')
const AppError = require('../util/appError')


// get overview
exports.getOverview = catchAsync(async (req, res, next) => {
    const tours = await Tour.find()
    res.status(200).render('overview', {
        title: 'All Tours',
        tours
    })
})



// get one tour
exports.getOneTour = catchAsync(async (req, res, next) => {
    const tour = await Tour
        .findOne({ slug: req.params.slug })
        .populate({ path: 'reviews', select: '-__v' })
    if (!tour) return next(new AppError('There is no tour with this name on the server', 404))

    res.status(200).render('tour', {
        title: tour.name,
        tour
    })
})



// get login
exports.getLogin = (req, res) => {
    res.status(200).render('login', {
        title: 'Log in'
    })
}



// get my account
exports.getMyAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'My Account',
    })
}



// get my account
exports.getSignup = (req, res) => {
    res.status(200).render('singup', {
        title: 'Sign up',
    })
}
