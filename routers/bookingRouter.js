const express = require('express')
const bookingController = require("./../controllers/bookingController")
const authController = require("./../controllers/authController")

const router = express.Router()

router.get("/checkout-session" , authController.authorizetion, authController.isVerified,bookingController.getCheckoutSeassion )
router.post("/payment-verify",bookingController.getCapture,bookingController.regOrder,bookingController.updateParticipants)
router.put("/cartin/:tourId",authController.authorizetion, authController.isVerified,bookingController.addToCart )
router.delete("/cartout/:tourId",authController.authorizetion, authController.isVerified,bookingController.delCart)
router.put("/iteminc/:tourId",authController.authorizetion, authController.isVerified,bookingController.increseItem)
router.put("/itemdec/:tourId",authController.authorizetion, authController.isVerified,bookingController.decreseItem)
router.post("/testroute/:tourId",bookingController.updateParticipants)


// router.post("/order-page",authController.authorizetion, authController.isVerified,bookingController.regOrder )



        





module.exports = router