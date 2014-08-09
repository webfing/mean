angular.module('qifuncomApp')
    .filter('newsType',function(){
        return function(val){
           return val=="business"? "行业新闻":"公司新闻";
        }
    })
    .filter('newsChannel',function(){
        return function(val){
           return val=="external"? "外链文章":"本站原创";
        }
    })

