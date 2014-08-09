'use strict';

angular.module('qifuncomApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {

    $scope.logout = function() {
      Auth.logout()
      .then(function() {
        $location.path('/qadmin/login');
      });
    };
    
    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
