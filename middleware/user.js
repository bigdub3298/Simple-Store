const User = require("../models/user");

module.exports = (req, _res, next) => {
  if (!req.session.userId) {
    return next();
  }

  User.findByPk(req.session.userId)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
};
