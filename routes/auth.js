const express = require("express");
const router = express.Router();
const { check } = require("express-validator/check");

const User = require("../models/user");

const authController = require("../controllers/auth");

router.get("/login", authController.getLoginPage);
router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ where: { email: value } }).then(user => {
          if (!user) {
            return Promise.reject(
              "The email or password you entered is incorrect."
            );
          }
          req.user = user;
        });
      })
  ],
  authController.postLoginPage
);

router.post("/logout", authController.postLogoutPage);

router.get("/signup", authController.getSignUpPage);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ where: { email: value } }).then(user => {
          if (user) {
            return Promise.reject("An account with this email already exists.");
          }
        });
      }),
    check(
      "password",
      "Please enter a password with at least 8 characters."
    ).isLength({ min: 8 }),
    check("confirmedPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords must match.");
      }
      return true;
    })
  ],
  authController.postSignUpPage
);

router.get("/reset", authController.getPasswordResetPage);

router.post(
  "/reset",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ where: { email: value } }).then(user => {
          if (!user) {
            return Promise.reject("No account with that email exists.");
          }
          req.user = user;
        });
      })
  ],
  authController.postPasswordResetPage
);

router.get("/reset/:token", authController.getNewPasswordPage);

router.post(
  "/new-password",
  [
    check(
      "password",
      "Please enter a password with at least 8 characters."
    ).isLength({ min: 8 }),
    check("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords must match.");
      }
      return true;
    })
  ],
  authController.postNewPasswordPage
);

module.exports = router;
