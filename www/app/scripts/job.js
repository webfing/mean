/*
申请职位
 */
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

//实例化表单处理类
new Form('#applyJobForm', {
    child: ['input', 'textarea'],
    submitBtn: '#submitBtn'
});

//七牛文件上传
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