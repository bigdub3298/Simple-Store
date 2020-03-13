const User = require("../models/user");

exports.getLoginPage = (req, res) => {
  res.render("auth/login", {
    docTitle: "Login",
    path: "/login",
    isAuthenticated: req.session.isAuthenticated
  });
};

exports.postLoginPage = (req, res) => {
  User.findByPk(1)
    .then(user => {
      req.session.userId = user.id;
      return user;
    })
    .then(_ => res.redirect("/"))
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
