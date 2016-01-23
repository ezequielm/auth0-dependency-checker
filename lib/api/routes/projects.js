'use strict';

var Projects = require('../controllers/projects');

module.exports = function(router) {
  router.post('/projects',
    Projects.create);
};
