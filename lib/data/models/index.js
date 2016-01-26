'use strict';

var Store = require('../../helpers/store');

module.exports = function() {
  if (process.env.DATA_STORE) {
    Store.existsFile()
      .then(function(result) {
        if (result) {
          return;
        }

        Store.createFile().catch(function(err) {
          return err;
        });
      });
  }
};
