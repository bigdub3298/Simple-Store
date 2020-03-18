const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");

router.get("/login", authController.getLoginPage);
router.post("/login", authController.postLoginPage);
router.post("/logout", authController.postLogoutPage);
router.get("/signup", authController.getSignUpPage);
router.post("/signup", authController.postSignUpPage);

module.exports = router;
