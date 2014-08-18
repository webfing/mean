'use strict';

var mongoose = require('mongoose'),
    File = require('../lib/file'),
    Post = mongoose.model('Post'),
    Applyer = mongoose.model('Applyer'),
    Job = mongoose.model('Job'),
    qiniu = require("qiniu");

// 配置密钥
qiniu.conf.ACCESS_KEY = '-YfstYVbxO1oziTBZrktjYBDgNuUybNa_HZBcYTX'
qiniu.conf.SECRET_KEY = 'IVQPY8m8BI00aH9e3RrlteWFx0lOuCNOPnOncgAc'

//获得上传token
var policy = new qiniu.rs.PutPolicy("qitest");
policy.deadline = 1451491200;
policy.fsizeLimit = 1000*1000*5;
//policy.saveKey = "testtesttest.doc";
var allowType = [
    "application/msword"            //doc.doc
    ,"application/vnd.openxmlformats-officedocument.wordprocessingml.document"  //docx.docx&&wps.docx

    ,"application/vnd.ms-works"     //wps.docx
    ,"application/wps-office.wps"     //wps.docx
    ,"application/wps-office.wpt"     //wps.docx
    ,"application/kswps"     //wps.docx
    ,"application/kset"     //wps.docx
    ,"application/ksdps"     //wps.docx
    ,"application/msword;application/rtf;application/msword-template"     //wps.docx
    ,"application/vnd.openxmlformats-officedocument.wordprocessingml.template"     //wps.docx
    ,"application/vnd.openxmlformats-officedocument.wordprocessingml.document"     //wps.docx

    ,"application/msword"           //wps.doc
    ,"application/kswps"            //wps.wps
    ,"application/pdf"              //pdf
    ,"image/jpeg"                   //jpg
    ,"image/png"                    //png

    ,"application/x-rar-compressed" //rar
    ," application/octet-stream" //rar

    ,"application/x-zip-compressed" //zip
    ,"application/x-compressed" //zip
    ,"application/zip" //zip
    ,"multipart/x-zip" //zip

];
policy.mimeLimit = allowType.join(";");
//policy.callbackUrl = "http://qifunhome.duapp.com/api/receiveQiniu";
//policy.callbackBody = "key=$(key)&hash=$(etag)&w=$(imageInfo.width)&h=$(imageInfo.height)";

var uptoken = policy.token();


/**
 * Get upload token
 */
exports.uptoken = function(req, res, next) {
    res.header("Cache-Control", "max-age=0, private, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
    if (uptoken) {
        res.json({
            uptoken: uptoken
        });
    }
}


/**
 * receive message
 */
exports.receiveQiniu = function(req, res) {
    var newToken = {
        "uptoken": uptoken
    };
    return res.json(newToken);
};



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
    var resMsg = {status:'ok',msg:'成功',data:null, channel:[]};
    Job.findOne({_id: req.params.id}, function (err, job) {
            resMsg.data = job;
            res.render('jobapply', resMsg);
        });
};

exports.jobFeAdd = function(req, res) {
    var resMsg = {status:'ok',msg:'成功',data:null};
    var nowDate, dateString;

    Applyer.findOne({email: req.body.email, jobType: req.params.id})
        .exec(function (err, applyer) {
            if (applyer){
                var applyerObj = {};
                applyerObj.name = req.body.name;
                applyerObj.phone = req.body.phone;
                applyerObj.accessory = req.body.file;
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
                    res.type("html");
                    return res.json(resMsg);
                });
            }else{
                var newApplyer = new Applyer();
                var newId = newApplyer._id;
                newApplyer.email = req.body.email;
                newApplyer.name = req.body.name;
                newApplyer.phone = req.body.phone;
                newApplyer.accessory = req.body.file;
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
                    res.charset = 'utf-8';
                    res.type("html");
                    return res.send(resMsg);
                });
            }
        });

};


// 本地上传版
/*exports.jobFeAdd = function(req, res) {
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
};*/