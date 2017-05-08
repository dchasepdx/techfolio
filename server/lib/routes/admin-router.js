const router = require('express').Router();

const User = require('../models/user');
const ensureToken = require('../auth/ensure-token')();
const ensureAdmin = require('../auth/ensure-admin')();

router
  .get('/', ensureToken, ensureAdmin, (req, res, next) => {
    User.find({})
      .then(users => res.send(users))
      .catch(next);
  })

  .delete('/:id', ensureToken, ensureAdmin, (req, res, next) => {
    User.findByIdAndRemove(req.params.id)
    .then(deleted => res.send(deleted))
    .catch(next);
  });

module.exports = router;
