'use strict';

var mongoose = require('mongoose'),
    File = require('../lib/file'),
    Thing = mongoose.model('Thing'),
    Post = mongoose.model('Post'),
    Applyer = mongoose.model('Applyer'),
    Job = mongoose.model('Job');

/**
 * Get awesome things
 */
exports.awesomeThings = function(req, res) {
  return Thing.find(function (err, things) {
    if (!err) {
      return res.json(things);
    } else {
      return res.send(err);
    }
  });
};

exports.postAdd = function(req, res) {
    var resMsg = {status:'ok',msg:'数据存储成功',data:null};
    var queryData = req.body;
     var postModel = new Post();
         postModel.title = queryData.title;
         postModel.type = queryData.type;
         postModel.thumb = queryData.thumb;
         postModel.brief = queryData.brief;
         postModel.channel = queryData.channel;
         postModel.target = queryData.channel == "external"? queryData.target: '';
         postModel.content = queryData.content;
         postModel.date = queryData.date;
         postModel.addtime = new Date(queryData.date).getTime();

    return postModel.save(function (err) {
        if (err) {
            resMsg.status = "error";
            resMsg.msg = err;
        }
        return res.json(resMsg);
    });
};

exports.postList = function(req, res) {
    var resMsg = {status:'ok',msg:'成功',data:null};
    return Post.find({})
        .sort({addtime:-1})
        .exec(function (err, posts) {
            if (!err) {
                resMsg.data = posts;
            } else {
                resMsg.status = "error";
                resMsg.msg = err;
            }
            return res.json(resMsg);
        });
};

exports.postDelete = function(req, res) {
    var resMsg = {status:'ok',msg:'文章删除成功',data:null};
    return Post.remove({_id: req.params.id}, function(err){
        if (err) {
            resMsg.status = "error";
            resMsg.msg = err;
        }
        return res.json(resMsg);
    })
 };

exports.postEdit = function(req, res) {
    var resMsg = {status:'ok',msg:'文章修改成功',data:null};
    var queryData = req.body;
    var postObj = {};
    postObj.title = queryData.title;
    postObj.type = queryData.type;
    postObj.thumb = queryData.thumb;
    postObj.brief = queryData.brief;
    postObj.channel = queryData.channel;
    postObj.target = queryData.channel == "external"? queryData.target: '';
    postObj.content = queryData.content;
    postObj.date = queryData.date;
    postObj.addtime = new Date(queryData.date).getTime();

    return Post.update({_id: queryData.id},{$set:postObj},function(err){
        if (err) {
            resMsg.status = "error";
            resMsg.msg = err;
        }
        return res.json(resMsg);
    });
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




//job


exports.jobAdd = function(req, res) {
    var resMsg = {status:'ok',msg:'数据存储成功',data:null};
    var queryData = req.body;
    var jobModel = new Job();
    jobModel.title = queryData.title;
    jobModel.type = queryData.type;
    jobModel.place = queryData.place;
    jobModel.responsibility = queryData.responsibility;
    jobModel.require = queryData.require;
    jobModel.priority = queryData.priority;
    jobModel.other = queryData.other;
    jobModel.number = queryData.number;

    var nowDate = new Date(),
        dateString = nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate();

    jobModel.addtime = nowDate.getTime();
    jobModel.date = dateString;
    return jobModel.save(function (err) {
        if (err) {
            resMsg.status = "error";
            resMsg.msg = err;
        }
        return res.json(resMsg);
    });
};

exports.jobList = function(req, res) {
    var resMsg = {status:'ok',msg:'成功',data:null};
    Job.find({})
        .sort({addtime:-1})
        .exec(function (err, posts) {
            if (!err) {
                if (posts.length>0){
                    posts.forEach(function(item, index){
                        Applyer.count({jobType: item._id, marked: false}, function(err, count){
                            item.applyers = count;
                            if (index == posts.length-1){
                                resMsg.data = posts;
                                return res.json(resMsg);
                            }
                        })
                    })
                }else{
                    resMsg.data = posts.data;
                    return res.json(resMsg);
                }

            } else {
                resMsg.status = "error";
                resMsg.msg = err;
            }
        });
};

exports.jobDelete = function(req, res) {
    var resMsg = {status:'ok',msg:'职位删除成功',data:null};
    return Job.remove({_id: req.params.id}, function(err){
        if (err) {
            resMsg.status = "error";
            resMsg.msg = err;
        }
        return res.json(resMsg);
    })
};

exports.jobEdit = function(req, res) {
    var resMsg = {status:'ok',msg:'职位修改成功',data:null};
    var queryData = req.body;
    var jobObj = {};
    jobObj.title = queryData.title;
    jobObj.type = queryData.type;
    jobObj.place = queryData.place;
    jobObj.responsibility = queryData.responsibility;
    jobObj.require = queryData.require;
    jobObj.priority = queryData.priority;
    jobObj.other = queryData.other;
    jobObj.number = queryData.number;

    return Job.update({_id: queryData.id},{$set:jobObj},function(err){
        if (err) {
            resMsg.status = "error";
            resMsg.msg = err;
        }
        return res.json(resMsg);
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


exports.resumeList = function(req, res){
    var resMsg = {status:'ok',msg:'成功',data:null};
    var option = {
        show: true
    };
    if (req.query.jobType){
        option.jobType = req.query.jobType
    };
    if (req.query.readed && (req.query.readed==1 || req.query.readed==0) ){
        option.marked = !!parseInt(req.query.readed);
    };
    Applyer.find(option)
        .sort({addtime:-1})
        .populate('jobType')
        .exec(function (err, resumes) {
            resMsg.data = resumes;
            return res.json(resMsg);
        });
}


exports.resumeAction = function(req, res){
    var resMsg = {status:'ok',msg:'成功',data:null};
    var action = req.params.action;

    if ( action == "mark" || action == "cancelMark"){
        var val = action=="mark"? true: false;
        Applyer.update({_id: req.params.id},{$set:{marked: val}}, function(err){
            if(err){
                resMsg.status = 'error';
                resMsg.msg = err;
            }
            return res.json(resMsg);
        })
    }else if(action=="remark"){
        Applyer.update({_id: req.params.id},{$set:{remark: req.body.remark}}, function(err){
            if(err){
                resMsg.status = 'error';
                resMsg.msg = err;
            }
            return res.json(resMsg);
        })
    }
}

exports.resumeDelete = function(req, res) {
    var resMsg = {status:'ok',msg:'删除成功',data:null};
    Applyer.update({_id: req.params.id},{$set:{show: false}}, function(err){
        if(err){
            resMsg.status = 'error';
            resMsg.msg = err;
        }
        return res.json(resMsg);
    })
};

exports.resumeRemove = function(req, res) {
    var resMsg = {status:'ok',msg:'删除成功',data:null};
    return Applyer.remove({_id: req.params.id}, function(err){
        if (err) {
            resMsg.status = "error";
            resMsg.msg = err;
        }
        return res.json(resMsg);
    })
};