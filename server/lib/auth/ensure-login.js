module.exports = function getEnsureLogin() {

  return function ensureLogin(req, res, next){
    if(!req.body.email || !req.body.password ||
       !req.body.firstName || !req.body.lastName) {
      return next({
        code: 400,
        error: 'Email, password, and full name are required to sign up.'
      });
    }
    next();
  };

};