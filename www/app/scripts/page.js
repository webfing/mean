$(function(){

    (function(){
        var current = 0,
            old = 0,
            banner = $("#focus"),
            imgList = banner.find('.imgList'),
            imgListItem = imgList.find('li'),
            listLength = imgList.find('li').length,
            imgHeight = imgList.find('li').height(),
            arrow = banner.find('.arrow a'),
            thumbList = banner.find('.imgBtn li'),
            thumb = banner.find('.imgBtn');

        imgListItem.eq(0).css("z-index", 8);

        thumbList.click(function(){
            var index = thumbList.index($(this));
            go(index);
        });
        arrow.click(function(){
            var toArrow = $(this).hasClass('prev')? "left": "right";
            go(toArrow);
        });
        banner.hover(function(){
            thumb.stop().animate({"bottom":0, easing: 'easeInQuart'},200);
        }, function(){
            thumb.stop().animate({"bottom":'-48px', easing: 'easeInQuart'},200);
        });

        function go(direction){
            old = current;
            if (typeof direction == 'string'){
                direction = direction == "left"? -1:1;
                current = current+direction;
                if (current+1>listLength){
                    current = 0;
                }
                if (current<0){
                    current = listLength-1;
                }
            }else{
                current = direction;
            }

            thumbList.removeClass('active').eq(current).addClass('active');

            //渐变
            imgListItem.eq(current).css({"z-index": "7", "display": "block"});
            imgListItem.eq(old).fadeOut(300, function(){
                $(this).css("z-index", "5");
                imgListItem.eq(current).css("z-index", "8");
            });

            //滚动
            //imgList.stop().animate({"top":-imgHeight*current, easing: 'easeInQuart'}, 300);
        }

    })();

    if ($("#mobShowPic").length>0){
        var picUl = $("#mobShowPic").find('ul'),
            picImgHeight = picUl.find('img').height();
            picImgWidth = picUl.find('img').width();

        $(".mobShow li").hover(function(){
            if ($(this).hasClass('active')) return;
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            var index = $(".mobShow li").index($(this));
            picUl.stop().animate({'left':-index*picImgWidth, easing: 'easeInQuart'}, 300);
        },function(){

        })
    }

    if($("#news").length>0 && isPC){
        $("#news li a").click(function(e){
            if ($(this).attr("data-source") != "external"){
                e.preventDefault();
                dialog.create(this.href);
            }
        })
    }

    if($(".coming").length>0){
        var height = $(window).height()-$("#header").height()-70;
        $(".coming").height(height);
    }

})


var dialog = (function(){
    function create(url){
        if ($(".dialogBg").length>0) return;
        var dialogBg = $('<div class="dialogBg"></div>');
        var dialogWrap = $('<div class="dialog"><div class="close">关闭 <i class="sprite"></i></div>  \
        <div class="dialogCont"> \
        <iframe src="'+url+'" frameborder="0" width="100%" height="100%"></iframe> \
        </div> \
    </div>');
        $('body').append(dialogBg);
        $('body').append(dialogWrap);
        dialogWrap.find('.close').click(function(){
            close();
        });
    };

    function close(){
        $(".dialogBg").remove();
        $(".dialog").remove();
    }

    return {
        create: create,
        close: close
    }
})();