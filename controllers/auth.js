const User = require("../models/user");
const Cart = require("../models/cart");
const bcrypt = require("bcrypt");

exports.getLoginPage = (req, res) => {
  res.render("auth/login", {
    docTitle: "Login",
    path: "/login"
  });
};

exports.postLoginPage = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ where: { email } })
    .then(user => {
      if (!user) {
        return res.redirect("/login");
      }

      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (!doMatch) {
            return res.redirect("/login");
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
  res.render("auth/signup", {
    docTitle: "Sign Up",
    path: "/signup"
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
          );
      }

      res.redirect("/signup");
    })
    .then(_ => res.redirect("/login"))
    .catch(err => console.log(err));
};
