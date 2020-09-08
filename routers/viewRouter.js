const express = require('express')
const viewController = require("./../controllers/viewController")
const authController = require("./../controllers/authController")
const bookingController = require("./../controllers/bookingController")
const router = express.Router()









router.get("/login",authController.isLoggedIn,viewController.login)

router.get("/signup",viewController.signup)
router.get("/verifyuser/:token", authController.verifyEmail,viewController.confirmation)

router.get("/",viewController.convertTo,authController.isLoggedIn, viewController.getOverview)

router.get("/tours/:tour", viewController.convertTo,authController.isLoggedIn,viewController.getTour)


router.get("/me",authController.authorizetion,authController.isVerified,viewController.me )
router.get("/myreview",authController.authorizetion,authController.isVerified,viewController.getUserReview)
router.get("/mycart",authController.authorizetion,authController.isVerified, viewController.getCart)
router.get("/mybooking",authController.authorizetion,authController.isVerified, viewController.getBookedTour)
router.get("/write-review/:tourId",authController.authorizetion,authController.isVerified,bookingController.bookingCheck,viewController.writeReview)
router.get("/edit-review/:tourId",authController.authorizetion,authController.isVerified, viewController.editReview)
router.get("/reset-password/:token", viewController.resetPassword)
router.get("/forgot-password/", viewController.forgotPassword)

// router.get("/testag", bookingController.aggrigateThis)







module.exports = router

