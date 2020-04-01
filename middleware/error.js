module.exports = (error, _req, res, _next) => {
  console.log(error);
  res.status(500).render("500", {
    docTitle: "Error",
    path: "/500"
  });
};
