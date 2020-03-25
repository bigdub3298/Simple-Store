require("dotenv").config();

const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const mailer = require("../sendgrid");
const crypto = require("crypto");

const User = require("../models/user");
const Cart = require("../models/cart");

exports.getLoginPage = (req, res) => {
  const errors = req.flash("error");
  const errorMessage = errors.length > 0 ? errors[0] : null;

  res.render("auth/login", {
    docTitle: "Login",
    path: "/login",
    errorMessage
  });
};

exports.postLoginPage = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ where: { email } })
    .then(user => {
      if (!user) {
        req.flash("error", "The email or password you entered is incorrect.");
        return req.session.save(err => {
          if (err) {
            console.log(err);
          }
          res.redirect("/login");
        });
      }

      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (!doMatch) {
            req.flash(
              "error",
              "The email or password you entered is incorrect."
            );
            return req.session.save(err => {
              if (err) {
                console.log(err);
              }
              res.redirect("/login");
            });
          }

          req.session.userId = user.id;
          req.session.save(err => {
            if (err) {
              console.log(err);
            }
            res.redirect("/");
          });
        })
        .catch(err => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch(err => console.log(err));
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
    errorMessage
  });
};

exports.postSignUpPage = (req, res) => {
  const { email, password, confirmedPassword } = req.body;

  User.findOne({ where: { email } })
    .then(user => {
      if (!user) {
        return bcrypt
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
          .catch(err => console.log(err));
      }

      req.flash("error", "An account with this email already exists.");
      return req.session.save(err => {
        if (err) {
          console.log(err);
        }
        res.redirect("/signup");
      });
    })
    .catch(err => console.log(err));
};

exports.getPasswordResetPage = (req, res) => {
  const errors = req.flash("error");
  const errorMessage = errors.length > 0 ? errors[0] : null;
  res.render("auth/reset", {
    docTitle: "Password Reset",
    path: "/reset",
    errorMessage
  });
};

exports.postPasswordResetPage = (req, res) => {
  const { email } = req.body;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }

    const token = buffer.toString("hex");
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) {
          req.flash("error", "No account with that email exists.");
          return req.session.save(err => {
            if (err) {
              console.log(err);
            }
            res.redirect("/reset");
          });
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 1600000;
        user.save().then(user => {
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
      })
      .catch(err => console.log(err));
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
    .catch(err => console.log(err));
};

exports.postNewPasswordPage = (req, res) => {
  const { password, confirmedPassword, userId, token } = req.body;

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
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};
