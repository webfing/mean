'use strict';

angular.module('qifuncomApp')
    .controller('NewsCtrl', function ($scope, $http, $timeout) {

        $scope.post = {
            title: '',
            content: '',
            type: 'firm',
            brief: '',
            channel: 'interior',
            target: '',
            date: moment().format('YYYY-MM-DD')
        };

        $scope.emptyTable = true;
        $scope.editshow = false;
        $scope.targetShow = false;

        var thumbDefault = "http://qifun.qiniudn.com/news-holder.jpg";


        var imgUpload = (function(){

            var thumbUpload = $("#thumbUpload"),
                addWrap = thumbUpload.find(".add"),
                loadingWrap = thumbUpload.find(".loading"),
                uploader,
                showImgWrap = thumbUpload.find(".showImg");

           showImgWrap.find(".remove") .click(function(event) {
               remove();
           });

            uploader = Qiniu.uploader({
                runtimes: 'html5,flash,html4',
                browse_button: 'upload',
                container: 'uploadBox',
                drop_element: 'uploadBox',
                max_file_size: '5mb',
                flash_swf_url: '../../bower_components/plupload/js/Moxie.swf',
                dragdrop: true,
                multi_selection: false,
                //unique_names: true,
                //save_key: true,
                chunk_size: '4mb',
                uptoken_url: '/api/uptoken',
                domain: 'http://qiupload.qiniudn.com/',
                auto_start: true,
                init: {
                    'FilesAdded': function(up, files) {
                        loading();
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
                        var sourceLink = domain + res.key;
                        sourceLink = sourceLink+"?imageView2/1/w/280/h/140";
                        showImg(sourceLink);
                    },
                    'Error': function(up, err, errTip) {
                        console.log(errTip);
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

            function loading(){
                thumbUpload.children('li').hide();
                loadingWrap.show();
            }

            function showImg(url){
                thumbUpload.children('li').hide();
                loadingWrap.show();
                var imgHolder = showImgWrap.find("img")[0];
                var img = new Image();
                img.onload = function(){
                    thumbUpload.children('li').hide();
                    imgHolder.src = url;
                    $scope.post.thumb = url;
                    showImgWrap.show();
                };
                img.src = url;
            }

            function remove(url){
                thumbUpload.children('li').hide();
                addWrap.show();
                $scope.post.thumb = thumbDefault;
            }

            return {
                showImg: showImg,
                remove: remove
            }

        })();


        $scope.$watch('post.channel', function(newVal, oldVal){
            if (newVal && newVal == 'external'){
                $scope.targetShow = true;
            }else{
                $scope.targetShow = false;
            }
        });

        function reInitEdit(){
            $scope.post.title = '';
            $scope.post.content = '';
            $scope.post.target = '';
            $scope.post.id = '';
            $scope.post.brief = '';
            $scope.post.channel = 'interior';
            $scope.post.type = 'firm';
            $scope.post.date = moment().format('YYYY-MM-DD');
            umText.setContent('');
            $scope.editshow = false;
            imgUpload.remove();
        }

        var umText;

        function editInit(){
            umText = new UE.ui.Editor({
                initialFrameHeight: 500,
                toolbar: [
                    'source | undo redo | bold italic underline strikethrough | forecolor backcolor | removeformat |',
                    'insertorderedlist insertunorderedlist | fontfamily fontsize' ,
                    '| justifyleft justifycenter justifyright justifyjustify |',
                    'link unlink | image video ',
                    '| preview fullscreen'
                ]
            });
            umText.render('umeditor');
        }

        $timeout(function(){
            editInit();
        },0);

        $scope.add = function(){
            $scope.editshow = true;
        };

        $scope.edit = function (item) {

            var method = 'POST';

            if (!!item){
                $scope.post.title = item.title;
                $scope.post.type = item.type;
                $scope.post.channel = item.channel;
                $scope.post.target = item.target;
                $scope.post.brief = item.brief;
                $scope.post.id = item._id;
                $scope.post.content = item.content;
                $scope.post.date = item.date;
                umText.setContent(item.content);
                $scope.editshow = true;
                $scope.post.thumb = item.thumb;
                if (thumbDefault !=item.thumb){
                  imgUpload.showImg(item.thumb);
                }
                return;
            }
            $scope.post.content = umText.getContent();
            //$scope.post.thumb = matchThumb($scope.post.content);
            util.blockUI("#editWrap");
            if (!!$scope.post.id){
                method = 'PUT';
            }
            $http({
                method: method,
                url: "/api/post",
                data    : $.param($scope.post),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
                .success(function(data){
                    if (data.status=="ok"){
                        reInitEdit();
                        $("#editWrap").unblock();
                        $timeout(function(){
                            $scope.query();
                        },0);
                    }
                    util.growlUI(data.msg, data.status);
                })
        };

        $scope.reset = function(){
            reInitEdit();
        };

        $scope.query = function(){
            util.blockUI("#table");
            $http({
                method: "GET",
                url: "/api/post"
            })
                .success(function(data){
                    if (data.status =="ok"){
                        $scope.emptyTable = false;
                        $scope.items = data.data;
                        $("#table").unblock();
                        $scope.emptyTable = data.data.length==0;
                    }else{
                        $scope.emptyTable = true;
                    }
                })
        }

        $scope.remove = function(id, index){
            $http({
                method: "DELETE",
                url: "/api/post/"+id
            })
                .success(function(data){
                    if (data.status =="ok"){
                        $scope.items.splice(index,1);
                        $scope.editshow && reInitEdit();
                    }else{
                        $scope.emptyTable = true;
                    }
                    util.growlUI(data.msg, data.status);
                })
        }

        $scope.test = function(){
            alert(1);
        }

        function matchThumb(content){
            var imgReg = /<img[^src]+src\s*=\s*"([^"]+)"/gi,
                imgs = imgReg.exec(content),
                thumb = '/images/news-holder.jpg';
            thumb = (imgs && imgs[1] && imgs[1].length>0) ? imgs[1] : thumb;
            if (!/^http:\/\//.test(thumb)){
                thumb = BossUrl+thumb;
            }
            return thumb;
        }

        $scope.query();

    });