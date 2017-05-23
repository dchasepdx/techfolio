/* eslint no-console: "off" */
require('./lib/connect');

const app = require('./lib/app');

const http = require('http');

const connect = require('./lib/connect');

const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/techfolio';
connect(dbUri);

const server = http.createServer(app);
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('server up on port ', server.address().port);
});