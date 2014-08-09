'use strict';

var mongoose = require('mongoose'),
    File = require('../lib/file'),
    Post = mongoose.model('Post'),
    Applyer = mongoose.model('Applyer'),
    Job = mongoose.model('Job');

exports.postFeList = function(req, res) {
    var resMsg = {status:'ok',msg:'成功',data:null, total: 0, current: 1};
    var option = {},
        start = 0,
        pageSize = 6;
    if (req.query.type && req.query.type != 'all'){
        option.type = req.query.type;
    }
    if (req.query.key && req.query.key.trim().length>0){
        option.content = new RegExp(req.query.key.trim(), "i");
    }
    if (req.query.page){
        start = (req.query.page-1)*pageSize;
    }
    if (req.query.page){
        resMsg.current = parseInt(req.query.page);
    }

    Post.count(option, function(err, count){
        resMsg.total = Math.ceil(count/pageSize);
        Post.find(option)
            .sort({addtime:-1})
            .skip(start)
            .limit(pageSize)
            .exec(function (err, posts) {
                resMsg.data = posts;
                return res.render('news', resMsg);
            });
    });
};

exports.postFeItem = function(req, res) {
    var resMsg = {status:'ok',msg:'成功',data:null};
    Post.findOne({_id: req.query.id})
        .exec(function (err, post) {
            resMsg.data = post;
            return res.render('article', resMsg);
        });
};

exports.jobFeList = function(req, res) {
    var resMsg = {status:'ok',msg:'成功',data:null};
    var option = {};

    Job.find(option)
        .sort({addtime:-1})
        .exec(function (err, jobs) {
            resMsg.data = jobs;
            return res.render('job', resMsg);
        });
};

exports.jobFeItem = function(req, res) {
    var resMsg = {status:'ok',msg:'成功',data:null};
    Job.findOne({_id: req.params.id})
        .exec(function (err, job) {
            resMsg.data = job;
            return res.render('jobitem', resMsg);
        });
};

exports.jobFeApply = function(req, res) {
    var resMsg = {status:'ok',msg:'成功',data:null};
    Job.findOne({_id: req.params.id})
        .exec(function (err, job) {
            resMsg.data = job;
            return res.render('jobapply', resMsg);
        });
};

exports.jobFeAdd = function(req, res) {
    var resMsg = {status:'ok',msg:'成功',data:null};
    var myFile = new File();
    var nowDate, dateString;

    if (req.files && req.files.file){
        myFile.check(req.files.file.path, function(err, msg, path){
            if (err){
                resMsg.status = 'error';
                resMsg.msg = err;
                return res.json(resMsg);
            }else{
                resMsg.msg = msg;
                Applyer.findOne({email: req.body.email, jobType: req.params.id})
                    .exec(function (err, applyer) {
                        if (applyer){
                            var applyerObj = {};
                            applyerObj.name = req.body.name;
                            applyerObj.phone = req.body.phone;
                            applyerObj.brief = req.body.brief;
                            nowDate = new Date();
                            dateString = nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate();
                            applyerObj.addtime = nowDate.getTime();
                            applyerObj.date = dateString;

                            Applyer.update({_id: applyer._id},{$set:applyerObj}, function(err){
                                if (err){
                                    resMsg.status = 'error';
                                    resMsg.msg = err;
                                }
                                res.json(resMsg);
                                saveFile(path, req.files.file.originalFilename, applyer._id);
                            });
                        }else{
                            var newApplyer = new Applyer();
                            var newId = newApplyer._id;
                            newApplyer.email = req.body.email;
                            newApplyer.name = req.body.name;
                            newApplyer.phone = req.body.phone;
                            newApplyer.brief = req.body.brief;
                            newApplyer.jobType = req.params.id;
                            newApplyer.marked = 0;
                            newApplyer.show = true;
                            nowDate = new Date();
                            dateString = nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate();
                            newApplyer.addtime = nowDate.getTime();
                            newApplyer.date = dateString;

                            newApplyer.save(function(err){
                                if (err){
                                    resMsg.status = 'error';
                                    resMsg.msg = err;
                                }
                                res.json(resMsg);
                                saveFile(path, req.files.file.originalFilename, newId);
                            });
                        }
                    });
            }
        });
    }else{
        Applyer.findOne({email: req.body.email, jobType: req.params.id})
            .exec(function (err, applyer) {
                if (applyer){
                    var applyerObj = {};
                    applyerObj.name = req.body.name;
                    applyerObj.phone = req.body.phone;
                    applyerObj.brief = req.body.brief;
                    applyerObj.accessory = '';
                    nowDate = new Date();
                    dateString = nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate();
                    applyerObj.addtime = nowDate.getTime();
                    applyerObj.date = dateString;
                    Applyer.update({_id: applyer._id },{$set:applyerObj}, function(err){
                        if (err){
                            resMsg.status = 'error';
                            resMsg.msg = err;
                        }
                        return res.json(resMsg);
                    });
                }else{
                    var newApplyer = new Applyer();
                    newApplyer.email = req.body.email;
                    newApplyer.name = req.body.name;
                    newApplyer.phone = req.body.phone;
                    newApplyer.brief = req.body.brief;
                    newApplyer.jobType = req.params.id;
                    newApplyer.accessory = '';
                    newApplyer.marked = 0;
                    newApplyer.show = true;
                    nowDate = new Date();
                    dateString = nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate();
                    newApplyer.addtime = nowDate.getTime();
                    newApplyer.date = dateString;
                    newApplyer.save(function(err){
                        if (err){
                            resMsg.status = 'error';
                            resMsg.msg = err;
                        }
                        return res.json(resMsg);
                    });
                }
            });
    }


    function saveFile(path, originName, id){
        myFile.upload(path, originName, function(targetPath){
            if (targetPath && targetPath.length>0){
                targetPath = targetPath.replace('./app', '');
            }else{
                targetPath = '';
            }
            Applyer.update({_id: id},{$set:{accessory:targetPath}}, function(err){
                console.log(err);
            });
        })
    }
};