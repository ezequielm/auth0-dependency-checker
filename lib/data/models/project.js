'use strict';

var Store = require('../../helpers/store');

exports.addProject = function(project) {
  return new Promise(function(resolve, reject) {
    if (!project.title) {
      return reject({
        status: 400,
        message: 'title parameter is missing'
      });
    }

    if (!project.repositoryUrl) {
      return reject({
        status: 400,
        message: 'repositoryUrl parameter is missing'
      });
    }

    Store.loadFile().then(function(result) {
      if (!result.projects) {
        result.projects = [];
      }

      var existProject = result.projects.filter(function(item) {
        return item.title === project.title;
      });

      if (existProject && existProject.length > 0) {
        return reject({
          status: 400,
          message: 'project already exists'
        });
      }

      result.projects.push(project);

      return Store.writeFile(result);
    }).then(function() {
      return resolve();
    }).catch(function(err) {
      return reject(err);
    });
  });
};
