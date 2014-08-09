'use strict';

var api = require('./controllers/api'),
    multipart = require('connect-multiparty'),
    multipartMiddleware = multipart();

/**
 * Application routes
 */
module.exports = function (app) {

    app.route('/webgame')
        .get(function(req, res){
            res.render('webgame');
        });

    app.route('/mobgame')
        .get(function(req, res){
            res.render('mobgame');
        });

    app.route('/job')
        .get(api.jobFeList);
    app.route('/job/:id')
        .get(api.jobFeItem);
    app.route('/job/:id/apply')
        .get(api.jobFeApply)
        .post(multipartMiddleware, api.jobFeAdd);

    app.route('/about')
        .get(function(req, res){
            res.render('about');
        });

    app.route('/video')
        .get(function(req, res){
            res.render('video');
        });

    app.route('/mission')
        .get(function(req, res){
            res.render('mission');
        });

    app.route('/coming')
        .get(function(req, res){
            res.render('coming');
        });

    app.route('/news')
        .get(api.postFeList);

    app.route('/article')
        .get(api.postFeItem);

    app.route('/contact')
        .get(function(req, res){
            res.render('contact');
        });

    app.route('/')
        .get(function(req, res){
            res.render('index');
        });
};