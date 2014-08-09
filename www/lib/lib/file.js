var fs = require('fs');
var _ = require('underscore')._;

/*安全文件标识*/
var safeType = {
    doc     : "d0cf11e0a1",
    wps		: "d0cf11e0a1",
    docx	: "504b030414",
    pptx	: "504b030414",
    pdf  	: "255044462d",
    ppt		: "d0cf11e0a1",
    jpg		: "ffd8ff",
    png		: "89504e470d"
};

/*类*/
function File(option){
    var root = this;
    this.option = _.extend({}, File.setting, option);
}

/*类静态属性*/
File.setting = {
    maxSize: 1000*1000*5,
    type: ['doc', 'jpg', 'pdf'],
    uploadPath: './app/upload/',
    msg: {
        nofind		: "亲，我把你弄丢了，再发一次吧",
        nofile		: "你的世界我不懂",
        oversize	: "对不起，您要减肥了",
        forbid		: "你想黑我吗！",
        hack		: "别想了，这是不可能的！",
        success		: "终于等到你了"
    }
};

/*类静态方法*/
File.addType = function(key, val){

    if (typeof key == 'string'){
        return add(key, val);
    }

    if (_.isObject(key)){
        for (var i in key){
            add(i, key[i]);
        }
    }

    function add(k, v){
        if (k in safeType) return;
        safeType[k] = v;
    }
};

File.showType = function(){
    return safeType;
};


/*原型*/
File.prototype = {
    constructor: File,
    check: function(path, cb){
        var root = this,
            opt = root.option,
            names = root.getName(path),
            postfix = names && names[2];

        if (!postfix){
            return cb(opt.msg.nofile);
        };

        size(path, opt.maxSize, function(error){
            if (error){
                cb(error);
            }else{
                header(path, function(error, head){
                    if (error){
                        cb(error);
                    }else{
                        type(postfix ,head, function(error){
                            if (error){
                                cb(error);
                            }else{
                                cb(null, opt.msg.success, path);
                            }
                        }, opt.msg.hack, opt.msg.forbid, opt.msg.nofile)
                    }
                });
            }
        }, opt.msg.nofind, opt.msg.oversize);
    },
    showType: File.showType,
    upload: function(path, originName, cb){
        var root = this,
            names = root.getName(path),
            postfix = names[2],
            targetPath = root.option.uploadPath+originName;

        fs.exists(targetPath, function(exists){
            if (exists){
                var newName = originName.replace(/\.([a-zA-Z]+)$/gi, function($$){
                    return '_'+(new Date().getTime())+$$;
                });
                targetPath = root.option.uploadPath+newName;
            }
            move(path, targetPath, function(err){
                cb(targetPath);
            });
        });
    },
    getName: function(path){
        var reg = /(?:\/|\\)([^\\\/:\*\?<>\|]+)\.([a-zA-Z]+)$/gi;
        return reg.exec(path);
    }
};


//判断文件大小时否符合
function size(path, maxSize, cb, nofindErrMsg, sizeErrMsg){
    fs.exists(path, function(exists){
        if (exists){
            fs.stat(path, function(error, stat){
                if (stat.size>maxSize){
                    cb(sizeErrMsg);
                }else{
                    cb(null);
                }
            });
        }else{
            cb(nofindErrMsg);
        }
    })
}

function type(postfix, head, cb, hackErrMsg, forbidErrMsg){
    var flag = false;
    for (var i in safeType){
        if (postfix == i){
            flag = true;
            if (head.indexOf(safeType[i])==0){
                cb(null);
                break;
            }else{
                cb(hackErrMsg);
            }
        }
    }
    if (!flag){
        cb(forbidErrMsg);
    }
}

function header(path, cb){
    fs.open(path, 'r', function(error, fd){
        var buf = new Buffer(10);
        fs.read(fd, buf, 0, 10, null, function(err){
            var data = buf.toString('hex', 0, 10);
            cb(null, data);
            fs.close(fd);
        });
    });
}


/*解释win下跨盘移动文件问题*/
function move(oldpath,newpath,callback){
    fs.rename(oldpath,newpath,function(err){
        if(err){
            if(err.code === 'EXDEV'){
                copyFile(oldpath, newpath, callback);
            }else{
                callback(err);
            }
        }else{
            callback();
        }
    });

    function copyFile(source, target, cb) {
        var cbCalled = false;
        var rd = fs.createReadStream(source);
        rd.on("error", function(err) {
            done(err);
        });
        var wr = fs.createWriteStream(target);
        wr.on("error", function(err) {
            done(err);
        });
        wr.on("close", function(ex) {
            done();
        });
        rd.pipe(wr);
        function done(err) {
            if (!cbCalled) {
                cb(err);
                cbCalled = true;
            }
        }
    }

}

module.exports = File;