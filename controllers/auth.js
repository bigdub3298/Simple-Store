exports.getLoginPage = (req, res) => {
  res.render("auth/login", {
    docTitle: "Login",
    path: "/login",
    isAuthenticated: req.session.isAuthenticated
  });
};

exports.postLoginPage = (req, res) => {
  req.session.isAuthenticated = true;
  res.redirect("/");
};
