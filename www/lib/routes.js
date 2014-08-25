'use strict';

var api = require('./controllers/api'),
    multipart = require('connect-multiparty'),
    config = require('./config/env/all'),
    //项目路径配置
    urlCfg = {
        HomeUrl: config.HomeUrl,
        BossUrl: config.BossUrl
    },
    multipartMiddleware = multipart();

/**
 * Application routes
 */
module.exports = function (app) {

    /*
    页面路由
     */
    app.route('/webgame')
        .get(function(req, res){
            res.render('webgame', urlCfg);
        });

    app.route('/mobgame')
        .get(function(req, res){
            res.render('mobgame');
        });

    app.route('/about')
        .get(function(req, res){
            res.render('about');
        });

    app.route('/video')
        .get(function(req, res){
            res.render('video', urlCfg);
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

    /*
    ajax路由
     */
    app.route('/api/uptoken')
        .get(api.uptoken);  
    //应用服务器回调，暂时关闭      
    /*app.route('/api/receiveQiniu')
        .post(api.receiveQiniu);*/ 
    app.route('/job')
        .get(api.jobFeList);
    app.route('/job/:id')
        .get(api.jobFeItem);
    app.route('/job/:id/apply')
        .get(api.jobFeApply)
        .post(multipartMiddleware, api.jobFeAdd);

    app.route('/')
        .get(function(req, res){
            res.render('index');
        });

    app.route('/*')
        .get(function(req, res){
            res.render('404');
        });
};