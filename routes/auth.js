const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");

router.get("/login", authController.getLoginPage);
router.post("/login", authController.postLoginPage);
router.post("/logout", authController.postLogoutPage);
router.get("/signup", authController.getSignUpPage);
router.post("/signup", authController.postSignUpPage);
router.get("/reset", authController.getPasswordResetPage);
router.post("/reset", authController.postPasswordResetPage);
router.get("/reset/:token", authController.getNewPasswordPage);
router.post("/new-password", authController.postNewPasswordPage);

module.exports = router;
