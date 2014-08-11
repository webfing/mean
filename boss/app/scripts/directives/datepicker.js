//日期选择指令
angular.module('qifuncomApp')
    .directive('qdatepicker', function () {
        return {
            restrict: 'A',
            require : 'ngModel',
            link : function (scope, element, attrs, ngModelCtrl) {
                $(function(){
                    element.datepicker({
                        language: 'zh-CN',
                        onSelect:function (date) {
                            ngModelCtrl.$setViewValue(date);
                            scope.$apply();
                        }
                    });
                });
            }
        }
    });