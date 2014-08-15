var jobPlatform = $("#jobPlatform");
var applyJob = $("#applyJob");
var fileUpBox = $("#fileUpBox");

$("#toPot").click(function(){
    jobPlatform.slideDown();
    applyJob.slideUp();
});
$("#writeJob").click(function(){
    applyJob.slideDown();
    jobPlatform.slideUp();
});

window.myFormTest = new Form('#applyJobForm', {
    child: ['input', 'textarea'],
    submitBtn: '#submitBtn'
});

/*var uploader = Qiniu.uploader({
    runtimes: 'html5,flash,html4',    //上传模式,依次退化
    browse_button: 'inputFile',       //上传选择的点选按钮，**必需**
    uptoken_url: '/api/uptoken',            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
    // downtoken_url: '/downtoken',
    // Ajax请求downToken的Url，私有空间时使用,JS-SDK将向该地址POST文件的key和domain,服务端返回的JSON必须包含`url`字段，`url`值为该文件的下载地址
    // uptoken : '<Your upload token>', //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
    unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
    // save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
    domain: 'http://qitest.qiniudn.com/',   //bucket 域名，下载资源时用到，**必需**
    container: 'uploadWrap',           //上传区域DOM ID，默认是browser_button的父元素，
    max_file_size: '5mb',           //最大文件体积限制
    flash_swf_url: '../../bower_components/plupload/js/Moxie.swf',  //引入flash,相对路径
    max_retries: 1,                   //上传失败最大重试次数
    dragdrop: true,                   //开启可拖曳上传
    drop_element: 'uploadWrap',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
    chunk_size: '4mb',                //分块上传时，每片的体积
    auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传,
    //x_vals : {
    //    自定义变量，参考http://developer.qiniu.com/docs/v6/api/overview/up/response/vars.html
    //    'time' : function(up,file) {
    //        var time = (new Date()).getTime();
              // do something with 'time'
    //        return time;
    //    },
    //    'size' : function(up,file) {
    //        var size = file.size;
              // do something with 'size'
    //        return size;
    //    }
    //},
    init: {
        'FilesAdded': function(up, files) {
            plupload.each(files, function(file) {
                // 文件添加进队列后,处理相关的事情
            });
            $("#inputFile").hide();
            $("#inputLoading").show();
            $(".moxie-shim").hide();
            hideMsg();
            alert('FilesAdded'+files);
        },
        'BeforeUpload': function(up, file) {
            alert('BeforeUpload'+file);
               // 每个文件上传前,处理相关的事情
        },
        'UploadProgress': function(up, file) {
            alert('UploadProgress'+file);

               // 每个文件上传时,处理相关的事情
        },
        'FileUploaded': function(up, file, info) {
            var domain = up.getOption('domain');
            var res = $.parseJSON(info);
            var sourceLink = domain + res.key; //获取上传成功后的文件的Url
            document.getElementById('fileUrl').value = sourceLink;

            setTimeout(function(){
                $("#inputFile").show();
                $("#inputLoading").hide();
                $(".moxie-shim").show();
                showMsg('.help-success', '上传成功('+res.key+')');
            },500);
            

               // 每个文件上传成功后,处理相关的事情
               // 其中 info 是文件上传成功后，服务端返回的json，形式如
               // {
               //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
               //    "key": "gogopher.jpg"
               //  }
               // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

               // var domain = up.getOption('domain');
               // var res = parseJSON(info);
               // var sourceLink = domain + res.key; 获取上传成功后的文件的Url
        },
        'Error': function(up, err, errTip) {
            if (err.status==403){
                return showMsg('.help-error', "文件类型不符合。请稍后重试。");
            }
            if (errTip){
                showMsg('.help-error', errTip);
            }
               //上传出错时,处理相关的事情
        },
        'UploadComplete': function() {
               //队列文件处理完毕后,处理相关的事情
        },
        'Key': function(up, file) {
            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
            // 该配置必须要在 unique_names: false , save_key: false 时才生效

            var key = "";
            // do something with key here
            return key
        }
    }
});*/

var uploader = Qiniu.uploader({
    runtimes: 'html5,flash,html4',
    browse_button: 'inputFile',
    container: 'uploadWrap',
    drop_element: 'uploadWrap',
    max_file_size: '5mb',
    flash_swf_url: '../../bower_components/plupload/js/Moxie.swf',
    dragdrop: true,
    multi_selection: false,
    //unique_names: true,
    //save_key: true,
    chunk_size: '4mb',
    uptoken_url: '/api/uptoken',
    domain: 'http://qitest.qiniudn.com/',
    auto_start: true,
    init: {
        'FilesAdded': function(up, files) {
            $("#inputFile").hide();
            $("#inputLoading").show();
            $(".moxie-shim").css("z-index", -5);
            hideMsg();
        },
        'BeforeUpload': function(up, file) {
        },
        'UploadProgress': function(up, file) {
        },
        'UploadComplete': function() {
        },
        'FileUploaded': function(up, file, info) {
            var domain = up.getOption('domain');
            var res = $.parseJSON(info);
            var sourceLink = domain + res.key; //获取上传成功后的文件的Url
            document.getElementById('fileUrl').value = sourceLink;

            setTimeout(function(){
                $("#inputFile").show();
                $("#inputLoading").hide();
                $(".moxie-shim").css("z-index", 0);
                showMsg('.help-success', '上传成功('+res.key+')');
            },500);
        },
        'Error': function(up, err, errTip) {
            if (err.status==403){
                return showMsg('.help-error', "文件类型不符合。请稍后重试。");
            }
            if (errTip){
                showMsg('.help-error', errTip);
            }
        },
        'Key': function(up, file) {
            var fileName = file.name;
            var size = file.size;
            var newName = fileName.replace(/\.([a-zA-Z]+)$/gi, function($$){
                return '_'+file.size+$$;
            });
            return newName;
            //return '';
        }
    }
});

function showMsg(type, msg){
    fileUpBox.find(".help").hide();
    fileUpBox.find(type).show().find('span').text(msg);
    $("#inputFile").show();
    $("#inputLoading").hide();
    $(".moxie-shim").css("z-index", 0);
}
function hideMsg(){
    fileUpBox.find(".help").hide();
}