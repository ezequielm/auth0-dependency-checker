'use strict';

/*eslint-disable */
process.env.NODE_ENV='test';
process.env.MONGOLAB_URI='mongodb://localhost/auth0-dependency-checker-test';
/*eslint-enable */

var request = require('supertest');
var api = require('../../lib/config/api.js');

exports.agent = request(api);
