const router = require('express').Router();
const request = require('request');
const User = require('../../models/user');
const LinkedIn = require('../../models/linkedin');
const token = require('../../auth/token');
const ensureToken = require('../../auth/ensure-token')();

const LINKEDIN_SECRET = process.env.LINKEDIN_SECRET;
const LINKEDIN_CLIENTID = process.env.LINKEDIN_CLIENTID;

router
  .get('/', (req, res) => {
    res.send('Successful - Redirecting...');
  })

  .get('/profile', ensureToken, (req, res, next) => {
    User.findById(req.user.id)
      .select('liAccess')
      .then(user => {
        let fields = [
          'headline',
          'picture-url',
          'positions',
          'specialties',
          'public-profile-url',
          'summary',
          'num-connections'
        ];
        let profileUrl = `https://api.linkedin.com/v1/people/~:(${fields.join()})`;
        let params = {
          oauth2_access_token: user.liAccess.oauth2_access_token,
          format: user.liAccess.format
        };
        return new Promise((resolve, reject) => {
          request.get({ url: profileUrl, qs: params, json: true }, (err, response, profile) => {
            if(err) return reject({ error: err });
            resolve(profile);
          });
        });
      })
      .then(profile => {
        let modProfile = {
          headline: profile.headline,
          connections: profile.numConnections,
          industry: profile.industry,
          pictureUrl: profile.pictureUrl,
          profileUrl: profile.publicProfileUrl,
          summary: profile.summary
        };
        if (profile.positions._total > 0) {
          modProfile.positionTitle = profile.positions.values[0].title;
          modProfile.positionCompany = profile.positions.values[0].company.name;
          modProfile.positionLocation = profile.positions.values[0].location.name;
          modProfile.positionSummary = profile.positions.values[0].summary;
        }
        res.send(modProfile);
      })
      .catch(error => next(error));
  })

  .get('/getprofile', ensureToken, function(req, res, next) {
    User.findById(req.user.id)
      .select('linkedIn')
      .then(user => {
        return LinkedIn.findById(user.linkedIn);
      })
      .then(data => res.send(data))
      .catch(error => next(error));
  })

  .post('/', function(req, res) {
    var accessTokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';
    var params = {
      code: req.body.code,
      client_id: LINKEDIN_CLIENTID,
      client_secret: LINKEDIN_SECRET,
      redirect_uri: 'https://techfolio.herokuapp.com/linkedin/',
      grant_type: 'authorization_code'
    };

    // Exchange authorization code for access token.
    request.post(accessTokenUrl, { form: params, json: true }, function(err, response, body) {
      if (response.statusCode !== 200) {
        return res.status(response.statusCode).send({ message: body.error_description });
      }
      var params = {
        oauth2_access_token: body.access_token,
        format: 'json'
      };
      let userToken = req.headers.authorization;

      token.verify(userToken)
        .then(({ id }) => User.findById(id))
        .then(user => {
          user.liAccess.oauth2_access_token = params.oauth2_access_token;
          user.liAccess.format = params.format;
          user.save();
          res.send({ token: params });
        });
    });
  })

  .post('/userupdate', ensureToken, (req, res, next) => {
    User.findById(req.user.id)
      .then(user => {
        if(user.linkedIn) {
          LinkedIn.findByIdAndUpdate(user.linkedIn, req.body)
            .then(() => res.send(user));
        } else {
          new LinkedIn(req.body)
            .save()
            .then(profile => {
              user.linkedIn = profile._id;
              return user.save();
            })
            .then(user => {
              res.send(user);
            });
        }
      })
      .catch(err => next(err));
  });

module.exports = router;
