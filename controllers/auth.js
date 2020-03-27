require("dotenv").config();

const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const mailer = require("../sendgrid");
const crypto = require("crypto");
const { validationResult } = require("express-validator");

const User = require("../models/user");
const Cart = require("../models/cart");

exports.getLoginPage = (req, res) => {
  const errors = req.flash("error");
  const errorMessage = errors.length > 0 ? errors[0] : null;

  res.render("auth/login", {
    docTitle: "Login",
    path: "/login",
    errorMessage,
    email: null,
    password: null
  });
};

exports.postLoginPage = (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      docTitle: "Login",
      path: "/login",
      errorMessage: errors.array()[0].msg,
      email
    });
  }

  bcrypt
    .compare(password, req.user.password)
    .then(doMatch => {
      if (!doMatch) {
        return res.render("auth/login", {
          docTitle: "Login",
          path: "/login",
          errorMessage: "The email or password you entered is incorrect.",
          email
        });
      }

      req.session.userId = req.user.id;
      req.session.save(err => {
        if (err) {
          console.log(err);
        }
        res.redirect("/");
      });
    })
    .catch(err => {
      const error = new Error(err);
      err.httpStatusCode = 500;
      return next(error);
    });
};

exports.postLogoutPage = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
};

exports.getSignUpPage = (req, res) => {
  const errors = req.flash("error");
  const errorMessage = errors.length > 0 ? errors[0] : null;
  res.render("auth/signup", {
    docTitle: "Sign Up",
    path: "/signup",
    errorMessage,
    email: null,
    password: null,
    confirmPassword: null
  });
};

exports.postSignUpPage = (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      docTitle: "Sign Up",
      path: "/signup",
      errorMessage: errors.array()[0].msg,
      email
    });
  }

  bcrypt
    .hash(password, 12)
    .then(hashedPassword =>
      User.create(
        { email, password: hashedPassword, cart: {} },
        { include: [Cart] }
      )
    )
    .then(_ => {
      const message = {
        to: email,
        from: process.env.EMAIL,
        subject: "Thanks For Signing Up With SimpleStore",
        html: "<h1>Your sign up was successful!</h1>"
      };

      res.redirect("/login");
      return mailer.send(message);
    })
    .catch(err => {
      const error = new Error(err);
      err.httpStatusCode = 500;
      return next(error);
    });
};

exports.getPasswordResetPage = (req, res) => {
  const errors = req.flash("error");
  const errorMessage = errors.length > 0 ? errors[0] : null;
  res.render("auth/reset", {
    docTitle: "Password Reset",
    path: "/reset",
    errorMessage,
    email: null
  });
};

exports.postPasswordResetPage = (req, res) => {
  const { email } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/reset", {
      docTitle: "Password Reset",
      path: "/reset",
      errorMessage: errors.array()[0].msg,
      email: email
    });
  }

  const user = req.user;

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      return res.status(422).render("auth/reset", {
        docTitle: "Password Reset",
        path: "/reset",
        errorMessage: err.message,
        email
      });
    }

    const token = buffer.toString("hex");

    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 1600000;
    user.save().then(_ => {
      const message = {
        to: email,
        from: process.env.EMAIL,
        subject: "Password Reset",
        html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
            `
      };
      res.redirect("/");
      return mailer.send(message);
    });
  });
};

exports.getNewPasswordPage = (req, res) => {
  const { token } = req.params;

  User.findOne({
    where: {
      resetToken: token,
      resetTokenExpiration: { [Sequelize.Op.gt]: Date.now() }
    }
  })
    .then(user => {
      if (!user) {
        req.flash("error", "Invalid reset token.");
        return req.session.save(err => {
          if (err) {
            console.log(err);
          }
          res.redirect("/reset");
        });
      }

      const errors = req.flash("error");
      const errorMessage = errors.length > 0 ? errors[0] : null;
      res.render("auth/new-password", {
        docTitle: "New Password",
        path: "/reset",
        errorMessage,
        userId: user.id,
        token
      });
    })
    .catch(err => {
      const error = new Error(err);
      err.httpStatusCode = 500;
      return next(error);
    });
};

exports.postNewPasswordPage = (req, res) => {
  const { password, userId, token } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("auth/new-password", {
      docTitle: "New Password",
      path: "/reset",
      errorMessage: errors.array()[0].msg,
      userId,
      token
    });
  }

  User.findOne({
    where: {
      id: userId,
      resetToken: token,
      resetTokenExpiration: { [Sequelize.Op.gt]: Date.now() }
    }
  })
    .then(user => {
      if (!user) {
        return res.redirect("/reset");
      }

      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          user.password = hashedPassword;
          user.resetToken = null;
          user.resetTokenExpiration = null;
          return user.save();
        })
        .then(user => {
          const message = {
            to: user.email,
            from: process.env.EMAIL,
            subject: "Password Reset Successful",
            html: "<p>Password has been successfully reset!</p>"
          };
          res.redirect("/login");
          return mailer.send(message);
        })
        .catch(err => {
          const error = new Error(err);
          err.httpStatusCode = 500;
          return next(error);
        });
    })
    .catch(err => {
      const error = new Error(err);
      err.httpStatusCode = 500;
      return next(error);
    });
};
