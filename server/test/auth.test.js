const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

const app = require('../lib/app');
const db = require('./db');
const userHelpers = require('./helpers/userConsts');

const request = chai.request(app);

describe('User authentication routes', () => {
  let token = null;


  before(db.drop);

  before(() => {
    return request
      .post('/auth/signup')
      .send(userHelpers.tokenUser)
      .then(res => res.body)
      .then(response => {
        assert.isOk(response.token);
        token = response.token;
        assert.isOk(token);
      });
  });

  const badRequest = (path, data, code, error) => {
    return request.post(path).send(data).then(
      userHelpers.expectedError,
      res => {
        assert.equal(res.status, code);
        assert.equal(res.response.body.error, error);
      }
    );
  };

  describe('signup error handling', () => {

    it('requires an email address to sign up', () => {
      return badRequest('/auth/signup', userHelpers.noEmail, 400, userHelpers.error);
    });

    it('requires a password to signup', () => {
      return badRequest('/auth/signup', userHelpers.noPass, 400, userHelpers.error);
    });

    it('requires a first name to signup', () => {
      return badRequest('/auth/signup', userHelpers.noFirst, 400, userHelpers.error);
    });

    it('requires a last name to signup', () => {
      return badRequest('/auth/signup/', userHelpers.noLast, 400, userHelpers.error);
    });

    it('requires a unique email to signup', () => {
      const duplicateError = `Username ${userHelpers.duplicateUser.email} already taken.`;
      return badRequest('/auth/signup', userHelpers.duplicateUser, 400, duplicateError);
    });
  });

  describe('singin error handling', () => {

    it('requires an email address to sign in', () => {
      return badRequest('/auth/signin', { password: 'password' }, 400, userHelpers.authError);
    });

    it('requires a password to sign in', () => {
      return badRequest('/auth/signin', {email: 'email@email.com'}, 400, userHelpers.authError);
    });
  });

  describe('token tests', () => {
    it('signs in and receives a token', () => {
      return request
        .post('/auth/signin')
        .send(userHelpers.tokenUser)
        .then(res => res.body.token)
        .then(token => {
          assert.isString(token);
        });
    });

    it('receives a token when signing up', () => {
      const jwtHeader = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

      return request
        .post('/auth/signup')
        .send(userHelpers.firstUser)
        .then(res => res.body.token)
        .then(token => {
          const tokenHeader = token.split('.')[0];
          assert.equal(tokenHeader, jwtHeader);
        });
    });

    it('validates a token using validation route', () => {

      return request
        .post('/auth/validate')
        .set('Authorization', token)
        .then(res => {
          assert.deepEqual(res.body, {valid:true});
        });
    });

    it('requires a token to hit the /auth route', () => {

      return request
        .get('/auth')
        .set('Authorization', token)
        .then(res => res.body)
        .then(user => {
          assert.equal(user.email, userHelpers.tokenUser.email);
          assert.equal(user.firstName, userHelpers.tokenUser.firstName);
          assert.equal(user.lastName, userHelpers.tokenUser.lastName);
          assert.deepEqual(user.roles, []); // roles wasn't added to original token user
        });
    });

    it('errors if you hit / without a token', () => {

      return request
        .get('/auth')
        .then(
          userHelpers.expectedError,
          err => {
            assert.equal(err.status, 403);
            assert.deepEqual(err.response.body, userHelpers.signInError);
          }
        );
    });

    it('errors if you hit / with an incorrect token', () => {

      return request
        .get('/auth')
        .set('Authorization', 'Not a token')
        .then(res => res.body)
        .then(
          userHelpers.expectedError,
          err => {
            assert.equal(err.status, 403);
            assert.deepEqual(err.response.body, userHelpers.signInError);
          }
        );
    });

  });
});
