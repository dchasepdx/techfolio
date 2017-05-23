const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

const app = require('../lib/app');
const db = require('./db');
const tokenUser = require('./helpers/userConsts').tokenUser;

const request = chai.request(app);

describe('users routes', () => {
  before(db.drop);

  before(() => {
    return request
      .post('/auth/signup')
      .send(tokenUser)
      .then(res => res.body)
      .then(response => {
        assert.isOk(response.token);
        tokenUser.token = response.token;
        assert.isOk(tokenUser.token);
      });
  });

  it('GETs a requested user', () => {
    return request
      .get('/user')
      .set('Authorization', tokenUser.token)
      .then(res => res.body)
      .then(user => {
        assert.isOk(user);
      });
  });


  it('POSTs personal information a user chooses', () => {
    return request
      .post('/user/personal')
      .set('Authorization', tokenUser.token)
      .send({ location: 'Portland', college: 'PSU', degree: 'BA' })
      .then(res => {

        assert.propertyNotVal(res.body, 'personalInfo');
        return res.body;
      })
      .then(user => {
        assert.property(user, 'personalInfo');
      });
  });
});
