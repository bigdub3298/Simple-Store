exports.getErrorPage = (req, res) => {
  res.status(404).render("not-found", {
    docTitle: "Not Found",
    path: "",
    isAuthenticated: req.session.isAuthenticated
  });
};
