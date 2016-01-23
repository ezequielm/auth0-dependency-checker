'use strict';

var express = require('express');
var apiRouter = express.Router(); //eslint-disable-line new-cap

module.exports = function(api) {
  require('./projects')(apiRouter);

  api.use('/api', apiRouter);
};
