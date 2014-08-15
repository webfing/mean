'use strict';

angular.module('qifuncomApp')
    .controller('JobCtrl', function ($scope, $http, $timeout) {

        $scope.job = {
            type: '技术类',
            place: '深圳',
            number: 3
        };

        $scope.emptyTable = true;
        $scope.editshow = false;
        $scope.targetShow = false;

        $scope.add = function(){
            $scope.editshow = true;
        };

        function reInitEdit(){
            $scope.job.type = '技术类';
            $scope.job.place = '深圳';
            $scope.job.number = 3;
            $scope.job.responsibility = '';
            $scope.job.require = '';
            $scope.job.priority = '';
            $scope.job.other = '';
            $scope.job.title = '';
            $scope.editshow = false;
        }

        $scope.edit = function (item) {

            var method = 'POST';

            if (!!item){
                $scope.job.title = item.title;
                $scope.job.type = item.type;
                $scope.job.place = item.place;
                $scope.job.responsibility = item.responsibility;
                $scope.job.require = item.require;
                $scope.job.priority = item.priority;
                $scope.job.other = item.other;
                $scope.job.number = item.number;
                $scope.job.id = item._id;
                $scope.editshow = true;
                return;
            }
            util.blockUI("#editWrap");
            if (!!$scope.job.id){
                method = 'PUT';
            }
            $http({
                method: method,
                url: "/api/job",
                data    : $.param($scope.job),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
                .success(function(data){
                    if (data.status=="ok"){
                        $("#editWrap").unblock();
                        reInitEdit();
                        //$scope.emptyTable = data.data.length==0;
                        $timeout(function(){
                            $scope.query();
                        },0);
                    }
                    util.growlUI(data.msg, data.status);
                })
        };

        $scope.reset = function(){
            $scope.editshow = false;
            reInitEdit();
        };

        $scope.query = function(){
            util.blockUI("#table");
            $http({
                method: "GET",
                url: "/api/job"
            })
                .success(function(data){
                    if (data.status =="ok"){
                        $scope.emptyTable = false;
                        $scope.items = data.data;
                        $("#table").unblock();
                    }else{
                        $scope.emptyTable = true;
                    }
                })
        }

        $scope.remove = function(id, index){
            $http({
                method: "DELETE",
                url: "/api/job/"+id
            })
                .success(function(data){
                    if (data.status =="ok"){
                        $scope.items.splice(index,1);
                        $scope.editshow = false;
                        reInitEdit();
                    }else{
                        $scope.emptyTable = true;
                    }
                    util.growlUI(data.msg, data.status);
                })
        }

        $scope.query();

    });