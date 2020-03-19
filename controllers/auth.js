const User = require("../models/user");
const Cart = require("../models/cart");
const bcrypt = require("bcrypt");

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
          .then(_ => res.redirect("/login"));
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
