/* eslint no-console: "off" */
const mongoose = require('mongoose');

mongoose.Promise = Promise;

module.exports = function(dbURI, { log = console.log } = {}) {
  if (mongoose.connection.readyState === mongoose.STATES.connected) {
    return Promise.reject('Mongoose already connected');
  }

  const promise = mongoose.connect(dbURI).then(() => mongoose.connection);
  // CONNECTION EVENTS
  mongoose.connection.on('connected', function() {
    log('Mongoose default connection open to ', dbURI);
  });

  mongoose.connection.on('error', function(err) {
    log('Mongoose default connection error: ', err);
  });

  mongoose.connection.on('disconnected', function() {
    log('Mongoose default connection disconnected');
  });

  process.on('SIGINT', function() {
    mongoose.connection.close(function() {
      log(
        'Mongoose default connection disconnected through app termination'
      );
      process.exit(0);
    });
  });
  return promise;
};
