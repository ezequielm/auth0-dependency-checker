'use strict';

var mongoose = require('mongoose');
var Project = mongoose.model('Project');

exports.create = function(req, res) {
  (new Project(req.body)).save(function(err, project) {
    if (err) {
      switch(err.name) {
        case 'ValidationError':
          return res.status(400).json(err);
        default:
          return res.status(500).json(err);
      }
    }

    res.status(201).json(project);
  });
};
