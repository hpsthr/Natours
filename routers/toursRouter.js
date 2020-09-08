const express = require('express')
const authController = require("./../controllers/authController")
const tourController = require('../controllers/tourController')
const reviewController = require('../controllers/reviewController')
const reviewRouter = require("./../routers/reviewRouter")
const { route } = require('./../routers/reviewRouter')

const router = express.Router()

router.use("/:tourId/reviews", reviewRouter)


router
    .route('/top_5_tours')
    .get(tourController.getAliases, tourController.getAlltours)

router
    .route("/tour_statics")
    .get(tourController.getTourstates)

router
    .route('/tours_date/:year')
    .get(authController.authorizetion,
        authController.isVerified,
        authController.toAccess("admin", "vender"),
        tourController.getDate)
router
.route("/tour-within/:distance/center/:latlng/unit/:unit")
.get(tourController.getTourWithin)
router
    .route("/")
    .get(tourController.getAlltours)
    .post(authController.authorizetion,
        authController.isVerified,
        authController.toAccess("admin","guide", "lead-guide"),
        tourController.getAllpost)

router
    .route("/:id")
    .get(tourController.getApitours)
    .delete(authController.authorizetion,
        authController.isVerified,
        authController.toAccess("admin","guide"),
        tourController.getApiDelete)
    .patch(authController.authorizetion,
        authController.isVerified,
        authController.toAccess("admin", "lead-guide"),
        tourController.uploadMulti,
        tourController.resizeTourPhoto,
        tourController.getAllput)
     



// router
//     .route("/:tourId/reviews")
//     .post(authController.authorizetion,
//         authController.isVerified,
//         authController.toAccess("user"),
//         reviewController.postReview)



module.exports = router