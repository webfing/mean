'use strict';

angular.module('qifuncomApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ui.bootstrap'
])
    .config(function ($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/index',
                controller: 'IndexCtrl',
                authenticate: true
            })
            .when('/login', {
                templateUrl: 'partials/login',
                controller: 'LoginCtrl',
                authenticate: true
            })
            .when('/news', {
                templateUrl: 'partials/news',
                controller: 'NewsCtrl',
                authenticate: true
            })
            .when('/jobs', {
                templateUrl: 'partials/job',
                controller: 'JobCtrl',
                authenticate: true
            })
            .when('/resumes', {
                templateUrl: 'partials/resume',
                controller: 'ResumeCtrl',
                authenticate: true
            })
            .when('/signup', {
                templateUrl: 'partials/signup',
                controller: 'SignupCtrl'
            })
            .when('/settings', {
                templateUrl: 'partials/settings',
                controller: 'SettingsCtrl',
                authenticate: true
            })

             .otherwise({
                redirectTo: '/'
             });

        $locationProvider.html5Mode(true);

        // Intercept 401s and redirect you to login
        $httpProvider.interceptors.push(['$q', '$location', function ($q, $location) {
            return {
                'responseError': function (response) {
                    if (response.status === 401) {
                        $location.path('/login');
                        return $q.reject(response);
                    }
                    else {
                        return $q.reject(response);
                    }
                }
            };
        }]);
    })
    .run(function ($rootScope, $location, Auth) {

        // Redirect to login if route requires auth and you're not logged in
        $rootScope.$on('$routeChangeStart', function (event, next) {

            if (next.authenticate && !Auth.isLoggedIn()) {
                $location.path('/login');
            }
        });
    });