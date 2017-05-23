const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

const app = require('../lib/app');
const request = chai.request(app);
const db = require('./db');

describe('User authentication routes', () => {
  let adminToken = '';
  let admin = {
    email: 'admin@email.com',
    password: 'Password',
    firstName: 'Ad',
    lastName: 'Min',
    roles: ['admin']
  };

  let token = '';
  let tokenUser = {
    email: 'unauth@email.com',
    password: 'Password',
    firstName: 'First',
    lastName: 'Last'
  };

  before(db.drop);

  before(() => {
    // Set up a tokened user for later tests
    return request
      .post('/auth/signup')
      .send(tokenUser)
      .then(res => res.body)
      .then(response => {
        assert.isOk(response.token);
        token = response.token;
      });
  });

  before(() => {
    // Set up a admin for later tests
    return request
      .post('/auth/signup')
      .send(admin)
      .then(res => res.body)
      .then(response => {
        assert.isOk(response.token);
        adminToken = response.token;
      });
  });

  /***************  ADMIN TESTS ***************************/

  it('requires admin access to hit the /admin route', () => {
    return request
      .get('/admin')
      .set('Authorization', adminToken)
      .then(res => {
        assert.isAbove(res.body.length, 0); // admin should get an array of all users back
      })
      .catch();
  });

  it('errors if you hit the /admin route as a normal user', () => {
    return request.get('/admin')
      .set('Authorization', token)
      .then(
        () => { throw new Error('response should not be 200');},
      res => {
        assert.equal(res.status, 401);
      }
    );
  });
});
