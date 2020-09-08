const {User} = require('./../models/userModel')
const Tour = require('./../models/tourmodel')
const {Review } = require("./../models/reviewModel")
const errorCatch = require("./../features/errorCatch")
const APIFeatures = require('./../features/apiFeatures')
const errHandling = require('./../features/errHandling')
const factory = require("./factoryController")


exports.getReview = factory.getAll(Review)
exports.editById = factory.factoryUp(Review)
exports.getRevId = factory.factoryFd(Review)
exports.postReview = factory.factoryCrt(Review)
exports.deleteReview = factory.factoryDel(Review)

exports.getTourAndUser = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId
    if (!req.body.user) req.body.user = req.user.id
    next();
}


exports.spamControll = errorCatch(async (req, res, next) => {
    const revSpam = await Review.findOne({
        tour: req.body.tour,
        user: req.body.user
    }, (err, user) => {
        if (user) {
            return next(new errHandling("you already review this tour if you change your prception about tour than you can edit the review", 401))
        }
    })
    next()
})



exports.editReview = errorCatch(async (req, res, next) => {
    
    const editRev = await Review.findOneAndUpdate({
        tour: req.body.tour,
        user: req.body.user
    }, req.body, {
        runValidators: true
    }) 



    res.status(201).json({
        status: 'success',
        data: editRev
    })

})


exports.getByUser = errorCatch(async (req, res, next) => {

    const userReview = await Review.find({
        user: req.user.id
    })

    res.status(201).json({
        status: "success",
        results: userReview.length,
        data: {
            userReview
        }
    })
})

