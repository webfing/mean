var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var config = require('../config/env/all');
var imgRootPath = config.BossUrl+'/uploads/';


module.exports = function(app) {

    var staticPath = app.get('env') == "production"? "public": "app";

    var uploadsPath = path.resolve(staticPath+'/uploads') + '/';//存储图片的路径

    var action = {
        /// 上传图片
        uploadimage: function (req, res) {
            var fstream;
            req.pipe(req.busboy);
            req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
                var filesize = 0;
                var ext = path.extname(filename);
                var newFilename = (new Date() - 0) + ext;
                fstream = fs.createWriteStream(uploadsPath + newFilename);
                file.on('data', function (data) {
                    filesize = data.length;
                });
                fstream.on('close', function () {
                    res.send(JSON.stringify({
                        "originalName": filename,
                        "name": newFilename,
                        "url": imgRootPath + newFilename,
                        "type": ext,
                        "size": filesize,
                        "state": "SUCCESS"
                    }));
                });
                file.pipe(fstream);
            });
        },
        /// 获取配置文件
        config: function (req, res) {
            var config = require('../config/ueditor.config.js');
            return res.json(config.cfg);
        },
        /// 在线管理
        listimage: function (req, res) {
            fs.readdir(uploadsPath, function (err, files) {
                var total = 0, list = [];
                console.log(uploadsPath, files);
                files.sort().splice(req.query.start, req.query.size).forEach(function (a, b) {
                    /^.+.\..+$/.test(a) &&
                    list.push({
                        url: imgRootPath + a,
                        mtime: new Date(fs.statSync(uploadsPath + a).mtime).getTime()
                    });
                });
                total = list.length;
                res.json({state: total === 0 ? 'no match file' : 'SUCCESS', list: list, total: total, start: req.query.start});
            });
        },
        /// 抓取图片（粘贴时将图片保存到服务端）
        catchimage: function (req, res) {
            var list = [];
            req.body.source.forEach(function (src, index) {
                http.get(src, function (_res) {
                    var imagedata = '';
                    _res.setEncoding('binary');
                    _res.on('data', function (chunk) {
                        imagedata += chunk
                    });
                    _res.on('end', function () {
                        var pathname = url.parse(src).pathname;
                        var original = pathname.match(/[^/]+\.\w+$/g)[0];
                        var suffix = original.match(/[^\.]+$/)[0];
                        var filename = Date.now() + '.' + suffix;
                        var filepath = uploadsPath + 'catchimages/' + filename;
                        fs.writeFile(filepath, imagedata, 'binary', function (err) {
                            list.push({
                                original: original,
                                source: src,
                                state: err ? "ERROR" : "SUCCESS",
                                title: filename,
                                url: imgRootPath + filename
                            });
                        })
                    });
                })
            });
            var f = setInterval(function () {
                if (req.body.source.length === list.length) {
                    clearInterval(f);
                    res.json({state: "SUCCESS", list: list});
                }
            }, 50);
           
        }
    };
      
    return {
        fileGet: function (req, res) {
            action[req.query.action](req, res);
        },
        fileUp: function (req, res) {
            action[req.query.action](req, res);
        }
    }
}