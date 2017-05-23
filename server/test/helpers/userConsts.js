module.exports = {
  noEmail: {
    password: 'Password',
    firstName: 'Name',
    lastName: 'Last',
  },
  noPass: {
    email: 'Whats@ina.name',
    firstName: 'Name',
    lastName: 'Last',
  },

  noFirst: {
    email: 'Whats@ina.name',
    password: 'Password',
    lastName: 'Last',
  },

  noLast: {
    email: 'Whats@ina.name',
    password: 'Password',
    firstName: 'Name',
  },

  duplicateUser: {
    email: 'user@email.com',
    password: 'Password',
    firstName: 'Already',
    lastName: 'SignedUp'
  },

  tokenUser: {
    email: 'user@email.com',
    password: 'password',
    firstName: 'First',
    lastName: 'Last'
  },

  firstUser: {
    email: 'first@email.com',
    password: 'Password',
    firstName: 'First',
    lastName: 'Last'
  },

  expectedError() {
    throw new Error('expecting an error, should not be 200');
  },

  signInError: {
    error: 'Sign In Error: Please log in again.'
  },
  
  error: 'Email, password, and full name are required to sign up.',

  authError: 'Invalid email address or password. Please try again.'
};
