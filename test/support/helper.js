'use strict';

var path = require('path');

/*eslint-disable */
process.env.NODE_ENV='test';
process.env.DATA_STORE=path.join(__dirname, '../projects.json');
/*eslint-enable */

var request = require('supertest');
var api = require('../../lib/config/api.js');

exports.agent = request(api);
