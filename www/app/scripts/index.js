(function(){
    if (window.location.pathname != '/') return;
    if (window.isPC || $(window).width()>1000){
        var num = -1;
        var currentNum = -1;
        var time = 1600;
        var ease = "easeInOutQuint";
        var scrollWidth = $(window).width();
        var scrollHeight = 750;

        var rollingNum = 0;
        var isRolling = true;
        var totalCount = 4;
        var rollingInterval;

        var pageW = 970;
        var pageH = 750;

        jQuery.fn.setButton = function() {
            $(this).each(function(index) {
                $(this).css({
                    'cursor': 'pointer'
                });
                this.imgs = $(this).find('img');
                this.mouseenterListener = function(event) {
                    this.imgs.eq(0).css({
                        'display': 'none'
                    });
                    this.imgs.eq(1).css({
                        'display': ''
                    });
                }
                this.mouseleaveListener = function(event) {
                    this.imgs.eq(0).css({
                        'display': ''
                    });
                    this.imgs.eq(1).css({
                        'display': 'none'
                    });
                }
                $(this).bind({
                    'mouseenter': this.mouseenterListener,
                    'mouseleave.default': this.mouseleaveListener

                });
            });
        };

        jQuery.fn.setNavi = function(num) {

            $(this).data('currentNum', num);

            var $item = $(this).eq(num);

            $(this).each(function(index) {

                $(this).bind({
                    click: function(event) {
                        if ($item) {
                            $item.bind('mouseleave.default', this.mouseleaveListener);
                            $item.trigger('mouseleave');

                        }

                        $item = $(this);

                        $(this).unbind('mouseleave.default');
                        $(this).trigger('mouseenter');

                    }
                });
            });

            $item.unbind('mouseleave.default');
            $item.trigger('mouseenter');
        }

        jQuery.fn.setButtonOpacity = function() {

            $(this).each(function(index) {

                this.time = 400;
                this.imgs = $(this).find('img').css({
                    'display': 'block',
                    'opacity': 0,
                    'cursor': 'pointer'
                });
                this.mouseenterListener = function(event) {
                    this.imgs.stop().animate({
                        'opacity': 1
                    }, this.time);
                }

                this.mouseleaveListener = function(event) {
                    this.imgs.stop().animate({
                        'opacity': 0
                    }, this.time);
                }

                $(this).bind({
                    'mouseenter': this.mouseenterListener,
                    'mouseleave.default': this.mouseleaveListener

                });
            });
        };

        function browserCheck() {
            var uAgent = navigator.userAgent.toLowerCase();
            var mobilePhones = new Array('iphone', 'ipad', 'firefox', 'android', 'chrome');

            for (var i = 0; i < mobilePhones.length; i++) {
                if (uAgent.indexOf(mobilePhones[i]) != -1) {
                    return mobilePhones[i];
                }
            }
        }

        function initDefault() {

            resize();
            $(window).resize(resize);

            $('#footer').css({
                'display': 'block'
            });

            var num = -1;

            var naviItem = $('.navi_item');
            naviItem.each(function(index) {

                this.time = 400;
                this.subItems = $('.subnavi_items');
                this.imgs = $(this).find('img').css({
                    'opacity': 0,
                    'cursor': 'pointer'
                }); /* 2013-04-05 ���� */

                this.mouseenterListener = function(event) {

                    if (num != -1) {
                        this.subItems.eq(num).stop().animate({
                            'top': -30
                        }, this.time, ease);
                        naviItem.eq(num).find('img').stop().animate({
                            'opacity': 0
                        }, this.time);
                    }
                    num = $(this).index();

                    if (num != 0) this.subItems.eq(num).stop().animate({
                        'top': 0
                    }, this.time, ease);
                    naviItem.eq(num).find('img').stop().animate({
                        'opacity': 1
                    }, this.time);
                }

                this.mouseleaveListener = function(event) {

                }

                $(this).bind({
                    'mouseenter': this.mouseenterListener,
                    'mouseleave': this.mouseleaveListener

                });

            });

            $('#navi_container').bind({
                mouseleave: function(event) {
                    var currentNum = naviItem.data('currentNum');
                    $('.subnavi_items').eq(num).stop().animate({
                        'top': -24
                    }, this.time, ease);
                    if (currentNum != 0) $('.subnavi_items').eq(currentNum).stop().animate({
                        'top': 0
                    }, this.time, ease);
                    naviItem.eq(num).find('img').stop().animate({
                        'opacity': 0
                    }, this.time);
                    naviItem.eq(currentNum).find('img').stop().animate({
                        'opacity': 1
                    }, this.time);
                    num = currentNum;
                }

            });

        }

        function wid() {
            var w = $(window).innerWidth();
            var wid = w > scrollWidth ? w : scrollWidth;
            return wid;
        }

        function hei() {
            var h = $(window).innerHeight();
            var hei = h > scrollHeight ? h : scrollHeight;
            return hei;
        }

        function sizeCheck() {
            return (wid() - scrollWidth) * .2;
        }

        function resize() {

            if (wid() <= scrollWidth) {
                $('html').css({
                    'width': scrollWidth,
                    'overflow-x': 'scroll'
                });
            } else {
                $('html').css({
                    'width': '100%',
                    'overflow-x': 'hidden'
                });
            }


            if (hei() <= scrollHeight) {
                $('html').css({
                    'height': scrollHeight,
                    'overflow-y': 'scroll'
                });
                $('#pages').css({
                    'height': scrollHeight - 130
                });
                $('#wrap').css({
                    'height': scrollHeight
                });
            } else {
                $('html').css({
                    'height': '100%',
                    'overflow-y': 'hidden'
                });
                $('#pages').css({
                    'height': hei() - 130
                });
                $('#wrap').css({
                    'height': hei()
                });
            }

        }

        $(document).ready(function() {
            var index = window.location.toString().lastIndexOf("/");
            var filename = window.location.toString().substr(index);

            var index = new Index();

        });


        (function(window) {

            Index = function(name) {
                this.init();
            }

            var p = Index.prototype;

            p.init = function() {

                var current = 0;
                var ratios = [
                    [0.02, 0, - 0.05],
                    [-0.02, 0, 0.05],
                    [0.02, 0, - 0.05],
                    [-0.03, 0, 0.06]
                ];
                var $pages = $('#pages');
                var $page = $('.page');
                var $menu = $('.navi_on div');
                var isRun = false;

                initDefault();
                initPages();
                initNavi();
                initMiniBtn();
                setIntervalRolling();

                function resize() {

                    moveLeftResize(current, 0);

                }

                resize();
                $(window, document).resize(resize);
                $page.eq(0).animate({
                    'margin-left': 0
                }, 2000, ease);
                $page.eq(1).animate({
                    'margin-left': 0
                }, 2000, ease);
                $page.eq(2).animate({
                    'margin-left': 0
                }, 2000, ease);
                $page.eq(3).animate({
                    'margin-left': 0
                }, 2000, ease);

                $('#arrow_right').delay(500).animate({
                    'right': 20
                }, 2000, ease);
                $('#arrow_left').delay(500).animate({
                    'left': 20
                }, 2000, ease);

                $('#dot_btn').delay(1000).animate({
                    'bottom': 10
                }, 2000, ease);

                function clickListener(event) {

                    if (isRun) return;

                    index = $(event.currentTarget).index();

                    if (current == 3 && index == 0) {
                        moveRight(index, time);
                    } else if (current == 0 && index == 3) {
                        moveLeft(index, time);
                    } else if (current > index) {
                        moveLeft(index, time);
                    } else if (current < index) {
                        moveRight(index, time);
                    }

                    current = index;
                }

                function setIntervalRolling() {
                    if (isRolling) {
                        clearIntervalRolling();
                        rollingInterval = setTimeout(function() {

                            current++;

                            if (current == 3) current = 0;

                            if (current == 0) {
                                moveLeft(current, time);
                            } else {
                                moveRight(current, time);
                            }

                            setNavi(current);
                            setIntervalRolling();

                        }, 5000);
                    }
                }

                function clearIntervalRolling() {
                    if (rollingInterval) clearTimeout(rollingInterval);
                }

                function initMiniBtn() {

                    $('.dot_btn_item').bind({

                        mouseenter: function(i) {},

                        mouseleave: function(i) {},

                        mousedown: function(i) {
                            isRolling = false;
                            clearIntervalRolling();
                        },

                        click: clickListener
                    });

                }

                function initNavi() {
                    initDefault();
                    $('.navi_item').setNavi();
                    $('.subnavi_item').setButtonOpacity();

                    $('.dot_btn_item').setButtonOpacity();
                    $('.dot_btn_item').setNavi(0);

                    $('.index_more_btn').setButtonOpacity();

                    $('#arrow_right').setButtonOpacity();
                    $('#arrow_left').setButtonOpacity();

                    $menu.bind({

                        click: this.clickListener,

                        mouseenter: function(event) {
                            num = $(event.currentTarget).index();
                        }
                    });

                }

                function initPages() {

                    $page.each(function(index) {

                        var $obj = $(this).find('.obj');

                        $obj.each(function(index2) {
                            var ratio = ratios[index][index2];
                            var $self = $(this);


                            var id = $self.attr('id');
                            $self.data('center', {
                                'left': $self.position().left,
                                'top': $self.position().top,
                                'ratio': ratio
                            });
                            $self.removeClass(id);

                            $self.addClass(id + '_left');
                            $self.data('left', {
                                'left': $self.position().left,
                                'top': $self.position().top,
                                'ratio': ratio
                            });
                            $self.removeClass(id + '_left');


                            $self.addClass(id + '_right');
                            $self.data('right', {
                                'left': $self.position().left,
                                'top': $self.position().top,
                                'ratio': ratio
                            });
                            $self.removeClass(id + '_right');

                        });

                    });

                    $('#pages').bind('mousemove', function(event) {

                        if (isRun) return;

                        var $obj = $page.eq(current).find('.obj');
                        var total = $obj.length;

                        for (i = 0; i < total; i++) {
                            var $self = $obj.eq(i);
                            var data = $self.data('center');
                            var centerX = wid() / 2;
                            var centerY = hei() / 2;

                            $self.stop().animate({
                                'left': data.left + (event.pageX - centerX) * data.ratio,
                                'top': data.top + (event.pageY - centerY) * data.ratio * .2
                            }, 400);
                        }
                    });

                }

                function setNavi(num) {
                    $('.dot_btn_item').eq(num).trigger('click');
                }

                function moveContents() {

                    isRun = true;

                    setTimeout(positionCheck, time + 200);
                }

                function moveRight(num, t) {

                    moveContents();

                    if (Math.abs(num - current) == 1) {
                        animateRight2($page.eq(returnCurrent(num + 1)), 0);
                    } else {
                        animateLeft2($page.eq(returnCurrent(num + 1)), t);

                        setTimeout(function() {
                            $page.eq(returnCurrent(num + 1)).stop(true, true);
                            animateRight2($page.eq(returnCurrent(num + 1)), 0);
                            animateRight($page.eq(returnCurrent(num + 1)), t - 200);
                        }, 600);

                    }

                    animateLeft2($page.eq(returnCurrent(num - 2)).delay(50), t);
                    animateLeft($page.eq(returnCurrent(num - 1)).delay(100), t);
                    animateCenter($page.eq(returnCurrent(num)).delay(150), t);
                    animateRight($page.eq(returnCurrent(num + 1)).delay(200), t);

                }

                function moveLeft(num, t, d) {

                    moveContents();

                    if (Math.abs(num - current) == 1) {
                        animateLeft2($page.eq(returnCurrent(num - 1)), 0);
                    } else {
                        animateRight2($page.eq(returnCurrent(num - 1)), t);

                        setTimeout(function() {
                            $page.eq(returnCurrent(num - 1)).stop(true, true);
                            animateLeft2($page.eq(returnCurrent(num - 1)), 0);
                            animateLeft($page.eq(returnCurrent(num - 1)), t - 200);
                        }, 600);

                    }

                    animateLeft($page.eq(returnCurrent(num - 1)).delay(200), t);
                    animateCenter($page.eq(returnCurrent(num)).delay(150), t);
                    animateRight($page.eq(returnCurrent(num + 1)).delay(100), t);
                    animateRight2($page.eq(returnCurrent(num + 2)).delay(50), t);

                }

                function moveLeftResize(num, t) {
                    animateLeft($page.eq(returnCurrent(num - 1)), t);
                    animateCenter($page.eq(returnCurrent(num)), t);
                    animateRight($page.eq(returnCurrent(num + 1)), t);
                    animateRight2($page.eq(returnCurrent(num + 2)), t);

                }

                function positionCheck() {

                    if (current == 0) {
                        animateRight2($page.eq(2), 0);
                    } else if (current == 1) {
                        animateRight2($page.eq(3), 0);
                    } else if (current == 2) {
                        animateLeft2($page.eq(0), 0);
                    } else if (current == 3) {
                        animateLeft2($page.eq(1), 0);
                    }

                    isRun = false;

                }

                function returnCurrent(current) {
                    var i;
                    if (current == -2) {
                        i = 2;
                    } else if (current == -1) {
                        i = 3;
                    } else if (current == 4) {
                        i = 0;
                    } else if (current == 5) {
                        i = 1;
                    } else {
                        i = current;
                    }
                    return i;
                }

                function animateRight($page, t) {

                    $page.animate({
                        'left': wid() - sizeCheck()
                    }, t, ease);
                    setRight($page, t);

                }

                function animateRight2($page, t) {
                    $page.animate({
                        'left': wid() - sizeCheck() + pageW
                    }, t, ease);
                }

                function animateCenter($page, t) {
                    $page.animate({
                        'left': (wid() - pageW) / 2
                    }, t, ease);


                    setCenter($page, t);
                }

                function animateLeft($page, t) {
                    $page.animate({
                        'left': sizeCheck() - pageW
                    }, t, ease);

                    setLeft($page, t);
                }

                function animateLeft2($page, t) {
                    $page.animate({
                        'left': sizeCheck() - pageW * 2
                    }, t, ease);
                }

                function setLeft($page, t) {
                    var $obj = $page.find('.obj');
                    $obj.each(function(index) {
                        var $self = $(this);
                        var data = $self.data('left');
                        var id = $self.attr('id');
                        $self.stop().delay(100).animate({
                            'left': data.left,
                            'top': data.top
                        }, t, ease);

                    });

                }

                function setRight($page, t) {

                    var $obj = $page.find('.obj');
                    $obj.each(function(index) {
                        var $self = $(this);
                        var data = $self.data('right');
                        var id = $self.attr('id');
                        $self.stop().delay(100).animate({
                            'left': data.left,
                            'top': data.top
                        }, t, ease);

                    });

                }

                function setCenter($page, t) {
                    var $obj = $page.find('.obj');
                    $obj.each(function(index) {
                        var $self = $(this);
                        var data = $self.data('center');
                        var id = $self.attr('id');
                        $self.stop().delay(100).animate({
                            'left': data.left,
                            'top': data.top
                        }, t, ease);

                    });

                }

            }

            p.initWorksItem = function(index) {

            }

            p.itemClick = function($worksText, index) {

            }

            p.xBtnClick = function() {

            }

        }(window));
    }
})();

$(function(){
    $("#quickNav").find('li').hover(function(){
        $(this).find('img').stop().animate({"top": "-5px"}, 300);
    },function(){
        $(this).find('img').stop().animate({"top": "0px"}, 300);
    })
})
