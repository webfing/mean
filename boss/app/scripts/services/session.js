'use strict';

angular.module('qifuncomApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
