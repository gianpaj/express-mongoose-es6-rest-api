const mongoose = require('mongoose');
const util = require('util');
const debug = require('debug')('express-mongoose-es6-rest-api:index');

// config should be imported before importing any other file
const config = require('./config/config');
const app = require('./config/express');


// connect to mongo db
const mongoUri = config.mongo.host;

const options = {
  keepAlive: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // socketTimeoutMS: 1000
};

mongoose.connect(mongoUri, options).then(
  () => {
    // eslint-disable-next-line no-console
    console.log(`connected to ${mongoUri}`);
  },
  (err) => {
    throw new Error(`unable to connect to: ${mongoUri} - ${err}`);
  }
);

// print mongoose logs in dev env
if (config.mongooseDebug) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  // listen on port config.port
  app.listen(config.port, () => {
    console.info(`server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
  });
}

module.exports = app;
