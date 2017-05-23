const router = require('express').Router();
const User = require('../models/user');
const ensureToken = require('../auth/ensure-token')();

router
  .get('/', ensureToken, (req, res, next) => {
    User.findById(req.user.id)
      .select('-ghaccess -liAccess -_id -password')
      .populate({ path: 'github' })
      .populate({ path: 'linkedIn' })
      .lean()
      .then(user => {
        res.send(user);
      })
      .catch(next);
  })

  .post('/personal', ensureToken, (req, res, next) => {
    User.findById(req.user.id)
      .then(user => {
        user.personalInfo = req.body;
        return user;
      })
      .then(user => user.save())
      .then(user => res.send(user))
      .catch(err => next(err));
  });

module.exports = router;
