
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const code = err.code || 500;
  const message = (code === 500) ? 'Internal Server Error' : err.error;
  res.status(code);
  res.send({error: message});
}

module.exports = errorHandler;