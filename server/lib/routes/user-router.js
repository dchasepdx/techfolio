const router = require('express').Router();
const User = require('../models/user');


router
  .get('/:userUrl', (req, res, next) => {
    User.findOne({ userUrl: req.params.userUrl })
      .select('-ghaccess -liAccess -_id -password')
      .populate({ path:'github' })
      .populate({ path:'linkedIn' })
      .then(user => {
        res.send(user);
      })
      .catch(next);
  });

module.exports = router;
