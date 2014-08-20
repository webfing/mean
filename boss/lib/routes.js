'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    upload = require('./controllers/upload'),
    users = require('./controllers/users'),
    session = require('./controllers/session'),
    busboy = require('connect-busboy'),
    middleware = require('./middleware');


/**
 * Application routes
 */
module.exports = function (app) {

    app.use(busboy()); 

    var uploader = upload(app);

    app.route('/api/post')
        .get(api.postList)
        .post(api.postAdd)
        .put(api.postEdit);

    app.route('/api/post/:id')
        .delete(api.postDelete);

    app.route('/api/job')
        .get(api.jobList)
        .post(api.jobAdd)
        .put(api.jobEdit);

    app.route('/api/job/:id')
        .delete(api.jobDelete);

    app.route('/api/resume')
        .get(api.resumeList);
    app.route('/api/resume/:id')
        .delete(api.resumeRemove);
    app.route('/api/resume/:id/:action')
        .post(api.resumeAction);

    app.route('/api/users')
        .post(users.create)
        .put(users.changePassword);
    app.route('/api/users/me')
        .get(users.me);
    app.route('/api/users/:id')
        .get(users.show);

    app.route('/api/session')
        .post(session.login)
        .delete(session.logout);

    app.route('/api/uploads')
        .get(uploader.fileGet)
        .post(uploader.fileUp);

    app.route('/api/uptoken')
        .get(api.uptoken); 

    app.route('/article')
        .get(api.postPreview);

    // All undefined api routes should return a 404
    app.route('/api/*')
        .get(function (req, res) {
            res.send(404);
        });

    app.route('/partials/*')
        .get(index.partials);
    

    app.route('/login')
        .get(middleware.setUserCookie, index.index);
    app.route('/resumes')
        .get(middleware.setUserCookie, index.index);
    app.route('/jobs')
        .get(middleware.setUserCookie, index.index);
    app.route('/news')
        .get(middleware.setUserCookie, index.index);
    app.route('/')
        .get(middleware.setUserCookie, index.index);
};