'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  title: { type: String, required: true },
  repositoryUrl: { type: String, required: true }
}, { timestamps: {} });

module.exports = mongoose.model('Project', ProjectSchema);
