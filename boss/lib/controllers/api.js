'use strict';

var mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
    Applyer = mongoose.model('Applyer'),
    qiniu = require("qiniu"),
    Job = mongoose.model('Job');

/*
七牛上传配置
 */

// 配置密钥
qiniu.conf.ACCESS_KEY = ''
qiniu.conf.SECRET_KEY = ''

//获得上传token
var policy = new qiniu.rs.PutPolicy("qiupload");
policy.deadline = 1451491200;
policy.fsizeLimit = 1000*1000*5;
//policy.saveKey = "testtesttest.doc";
var allowType = [
    "image/jpeg"                   //jpg
    ,"image/png"                    //png
];
policy.mimeLimit = allowType.join(";");

var uptoken = policy.token();


/**
 * 获取 upload token
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

/*
新增新闻
 */
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

/*
新闻列表
 */
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

/*
删除新闻
 */
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

/*
编辑新闻
 */
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

/*
新闻预览
 */
exports.postPreview = function(req, res) {
    var resMsg = {status:'ok',msg:'成功',data:null};
    Post.findOne({_id: req.query.id})
        .exec(function (err, post) {
            resMsg.data = post;
            return res.render('article', resMsg);
        });
};


/*
新增新闻
 */
exports.jobAdd = function(req, res) {
    var resMsg = {status:'ok',msg:'数据存储成功',data:null};
    var queryData = req.body;
    var jobModel = new Job();
    jobModel.title = queryData.title;
    jobModel.type = queryData.type;
    jobModel.place = queryData.place;
    jobModel.responsibility = queryData.responsibility;
    jobModel.channel = queryData.channel;
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

/*
新闻列表
 */
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

/*
删除新闻
 */
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

/*
编辑新闻
 */
exports.jobEdit = function(req, res) {
    var resMsg = {status:'ok',msg:'职位修改成功',data:null};
    var queryData = req.body;
    var jobObj = {};
    jobObj.title = queryData.title;
    jobObj.type = queryData.type;
    jobObj.place = queryData.place;
    jobObj.responsibility = queryData.responsibility;
    jobObj.channel = queryData.channel;
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

/*
简历列表
 */
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

/*
操作简历
 */
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

/*
禁用简历
 */
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

/*
删除简历
 */
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