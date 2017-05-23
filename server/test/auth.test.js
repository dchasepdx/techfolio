const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

const app = require('../lib/app');
const db = require('./db');
const userHelpers = require('./helpers/userConsts');

const request = chai.request(app);

describe('User authentication routes', () => {


  before(db.drop);

  before(() => {
    return request
      .post('/auth/signup')
      .send(userHelpers.tokenUser)
      .then(res => res.body)
      .then(response => {
        assert.isOk(response.token);
        userHelpers.tokenUser.token = response.token;
        assert.isOk(userHelpers.tokenUser.token);
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
        .set('Authorization', userHelpers.tokenUser.token)
        .then(res => {
          assert.deepEqual(res.body, {valid:true});
        });
    });
  });
});
