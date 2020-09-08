const express = require('express')
const reviewController = require("./../controllers/reviewController")
const authController = require("./../controllers/authController")

const router = express.Router({mergeParams: true})


router.use(authController.authorizetion,authController.isVerified)

router
    .route("/")
    .get(reviewController.getReview)
    .post(authController.toAccess("user"),reviewController.getTourAndUser,
    // reviewController.spamControll,
    reviewController.postReview);

router
    .route("/edit")
    .patch(authController.toAccess("user", "admin"),reviewController.getTourAndUser,reviewController.editReview)

router.route("/:id")
    .get(authController.toAccess("user", "admin"), reviewController.getRevId)
    .patch(authController.toAccess("user","admin"),reviewController.editById)
    .delete(authController.toAccess("user", "admin"), reviewController.deleteReview)

        





module.exports = router