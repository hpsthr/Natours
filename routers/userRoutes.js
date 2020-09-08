const express = require('express');

const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');

const router = express.Router();




router.post("/signup",authController.signup, authController.sendEmailVerification)
router.post("/login",authController.login)
router.get("/logout",authController.logOut)
router.get("/verify/:token", authController.verifyEmail,authController.confirmVerification)
router.post("/forgotPassword", authController.forgotPassword)
router.patch("/resetPassword/:token",authController.resetPassword);

router.use(authController.authorizetion,authController.isVerified)

router.get("/me",userController.getMe,userController.getUser)
router.get("/reviews",authController.toAccess("user"), reviewController.getByUser)


router.patch("/updateMyPassword",authController.updatePassword)
router.patch("/updateMe",userController.userPhotoUpload, userController.resizeUserPhoto, userController.updateMe)
router.delete("/deleteMe",userController.deleteMe)



router
  .route('/')
  .get(authController.toAccess("admin"),userController.getAllUsers)
  .post(authController.toAccess("admin"),userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);






module.exports = router;