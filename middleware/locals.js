module.exports = (req, res, next) => {
  res.locals.isAuthenticated = req.session.userId;
  res.locals.csrfToken = req.csrfToken();
  next();
};
