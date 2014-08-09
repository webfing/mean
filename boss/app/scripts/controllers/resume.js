'use strict';

angular.module('qifuncomApp')
    .controller('ResumeCtrl', function ($scope, $http, $timeout, $routeParams) {

        $scope.resume = {};

        $scope.emptyTable = true;
        $scope.editshow = false;
        $scope.targetShow = false;

        $scope.queryParams = {
            jobType: $routeParams.jobType,
            readed: parseInt($routeParams.marked) || 0
        };

        $http({
            method: "GET",
            url: "/api/job"
        })
            .success(function(data){
                if (data.status =="ok"){
                    $scope.jobs = data.data;
                }else{
                    util.growlUI(data.msg, data.status);
                }
            })

        $scope.query = function(){
            util.blockUI("#table");
            return $http({
                method: "GET",
                url: "/api/resume?"+ $.param($scope.queryParams)
            })
                .success(function(data){
                    if (data.status =="ok"){
                        $scope.emptyTable = false;
                        $scope.items = data.data;
                        $("#table").unblock();
                    }
                    $scope.emptyTable = data.data.length==0;
                    $timeout(function(){
                        $('.briefPop').popover();
                    },0);
                })
        }

        $scope.remove = function(id, index){
            $http({
                method: "DELETE",
                url: "/api/resume/"+id
            })
                .success(function(data){
                    if (data.status =="ok"){
                        $scope.items.splice(index,1);
                        $scope.editshow && reInitEdit();
                    }
                    $scope.emptyTable = $scope.items.length==0;
                    util.growlUI(data.msg, data.status);
                })
        };

        $scope.mark = function(id, index){
            $http({
                method: "POST",
                url: "/api/resume/"+id+"/mark"
            })
                .success(function(data){
                    if (data.status == "ok"){
                        $scope.items[index].marked = true;
                    }
                    util.growlUI(data.msg, data.status);
                })
        };

        $scope.cancelMark = function(id, index){
            $http({
                method: "POST",
                url: "/api/resume/"+id+"/cancelMark"
            })
                .success(function(data){
                    if (data.status == "ok"){
                        $scope.items[index].marked = false;
                    }
                    util.growlUI(data.msg, data.status);
                })
        };

        $scope.remark = function(id, index, text){
            $("#markModal").modal();
            $scope.editMarkId = id;
            $scope.editMarkIndex = index;
            $scope.editMarkText = text;
        };

        $scope.saveMark = function(){
            $http({
                method: "POST",
                url: '/api/resume/'+$scope.editMarkId+'/remark',
                data: $.param({remark: $scope.editMarkText}),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
                .success(function(data){
                    if (data.status == "ok"){
                        $scope.items[$scope.editMarkIndex].remark = $scope.editMarkText;
                        $('#markModal').modal('hide');
                    }
                    util.growlUI(data.msg, data.status);
                })
        };

        $scope.query();

    });