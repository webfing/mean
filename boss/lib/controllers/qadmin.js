'use strict';

var path = require('path');

/**
 * Send our single page app
 */
exports.index = function(req, res) {
  res.render('qadmin');
};
