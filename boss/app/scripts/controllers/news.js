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
        }

        var umText = UE.getEditor('umeditor', {
            /* 传入配置参数,可配参数列表看umeditor.config.js */
            toolbar: [
                'source | undo redo | bold italic underline strikethrough | forecolor backcolor | removeformat |',
                'insertorderedlist insertunorderedlist | fontfamily fontsize' ,
                '| justifyleft justifycenter justifyright justifyjustify |',
                'link unlink | image video ',
                '| preview fullscreen'
            ]
        });

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
                return;
            }
            $scope.post.content = umText.getContent();
            $scope.post.thumb = matchThumb($scope.post.content);
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
                        $timeout(function(){
                            // $(".newsDelete").popover({
                            //     html: true
                            // });
                        },0);
                        
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
                thumb = "http://localhost:9000"+thumb;
            }
            return thumb;
        }

        $scope.query();

    });