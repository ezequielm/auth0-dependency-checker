'use strict';

var Project = require('../../data/models/project');

exports.create = function(req, res) {
  Project.addProject(req.body)
    .then(function() {
      res.sendStatus(201);
    }).catch(function(err) {
      if(err.status) {
        return res.status(err.status).json(err.message);
      }

      res.status(500).json(err);
    });
};
