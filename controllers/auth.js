exports.getLoginPage = (_, res) => {
  res.render("auth/login", {
    docTitle: "Login",
    path: "/login"
  });
};
