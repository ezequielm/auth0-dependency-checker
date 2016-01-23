'use strict';

var path = require('path');
var mongoose = require('mongoose');

module.exports = function() {
  mongoose.connect(process.env.MONGOLAB_URI, {
    db: {
      safe: true
    }
  });

  require('fs').readdirSync(__dirname).forEach(function (file) {
    if (file === 'index.js') {
      return;
    }

    require(path.join(__dirname, file));
  });
};
