exports.get404 = (req, res) => {
  res.status(404).render("404", {
    docTitle: "Not Found",
    path: "/404"
  });
};

exports.get500 = (req, res) => {
  res.status(500).render("500", {
    docTitle: "Error",
    path: "/500"
  });
};
