'use strict';

var fs = require('fs');

exports.existsFile = function() {
  return new Promise(function(resolve) {
    fs.exists(process.env.DATA_STORE, function(exists) {
      resolve(exists);
    });
  });
};

exports.createFile = function() {
  return new Promise(function(resolve, reject) {
    fs.writeFile(process.env.DATA_STORE, JSON.stringify({}), function(err) {
      if(err) {
        return reject(err);
      }

      resolve();
    });
  });
};

exports.loadFile = function() {
  return new Promise(function(resolve, reject) {
    fs.readFile(process.env.DATA_STORE, function(err, contents) {
      if(err) {
        return reject(err);
      }

      resolve(JSON.parse(contents));
    });
  });
};

exports.writeFile = function(contents) {
  return new Promise(function(resolve, reject) {
    fs.writeFile(process.env.DATA_STORE, JSON.stringify(contents), function(err) {
      if(err) {
        return reject(err);
      }

      resolve();
    });
  });
};
