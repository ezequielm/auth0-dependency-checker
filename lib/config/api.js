'use strict';

var api = require('express')();
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');

api.use(logger('dev', {
  skip: function () {
    return process.env.NODE_ENV === 'test';
  }
}));
api.use(bodyParser.urlencoded({
  extended: true
}));
api.use(cookieParser());
api.use(compress());
api.use(methodOverride());

api.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Authorization, ' +
    'Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  res.header('Access-Control-Expose-Headers', 'X-Flash-Message, Link');
  res.header('Access-Control-Allow-Methods', 'POST, PUT, DELETE, GET, OPTIONS');
  next();
});

api.all('/*', function(req, res) {
  res.json({
    process: process.pid
  });
});

module.exports = api;
