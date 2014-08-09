'use strict';

angular.module('qifuncomApp')
  .directive('rmComfirm', function () {
    return {
      restrict: 'A',
      scope: {
        onComfirm: '&'      // Pass a reference to the method 
      },
      link: function(scope, element, attrs, ngModel) {
        var pop;
        element.popover({
          title: "确定删除？",
          content: '<button class="btn btn-danger comfirm" ng-click="test(item._id, $index)">确定</button> <button class="btn btn-info reset">取消</button>',
          html: true
        });
        element.on('shown.bs.popover', function (e) {
          pop = element.next(".popover");
          pop.find(".comfirm").click(function(){
            scope.onComfirm();
          });
          pop.find(".reset").click(function(){
            element.popover("hide");
          })
        })
      }
    };
  });