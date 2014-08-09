'use strict';

window.util = (function(){

    //设置block默认层样式
    $.blockUI.defaults.overlayCSS = {
        backgroundColor:'#fff',
        opacity:        '0.8'
    };

    //block包装函数
    var blockUI = function (el, type) {
        var elem = jQuery(el),
            style = {
                css: {
                    message: '<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>',
                    css: {
                        top: '50%',
                        border: 'none',
                        padding: '2px',
                        backgroundColor: 'none'
                    },
                    overlayCSS: {
                        backgroundColor: '#fff',
                        opacity: 0.8,
                        cursor: 'wait'
                    }
                },
                text: {
                    message: '<h4><img src="../image/busy.gif" /> loading...</h4>'
                }
            };
        type  = type || "css";
        if (style[type]){
            elem.block(style[type]);
        }
    };

    /**
     *  growlUI包装
     *  type: alert/info/success
     */
    var growlUI = function(msg, type, timeout, onClose){
        type = type || 'info';
        var $m = $('<div class="growlUI"></div>');
        var title = growlUI.title[type]['val'] || '提示';
        var css = $.extend({}, $.blockUI.defaults.growlCSS, {background: growlUI.title[type]['bg']});
        $m.append('<h1>'+title+'</h1><h2>'+msg+'</h2>');
        if (timeout === undefined) timeout = 3000;

        var callBlock = function(opts) {
            opts = opts || {};
            $.blockUI({
                message: $m,
                fadeIn: typeof opts.fadeIn !== 'undefined' ? opts.fadeIn : 700,
                fadeOut: typeof opts.fadeOut !== 'undefined' ? opts.fadeOut : 1000,
                timeout: typeof opts.timeout !== 'undefined' ? opts.timeout : timeout,
                centerY: false,
                showOverlay: false,
                css: css
            });
        }

        callBlock();
        var nonmousedOpacity = $m.css('opacity');
        $m.mouseover(function() {
            callBlock({
                fadeIn: 0,
                timeout: 30000
            });

            var displayBlock = $('.blockMsg');
            displayBlock.stop(); // cancel fadeout if it has started
            displayBlock.fadeTo(300, 1); // make it easier to read the message by removing transparency
        }).mouseout(function() {
            $('.blockMsg').fadeOut(1000);
        });

    };

    growlUI.title = {
        error: {
            val: "错误",
            bg: "#e02222"
        },
        alert: {
            val: "警告",
            bg: "#e02222"
        },
        fail: {
            val: "失败",
            bg: "#e02222"
        },
        info: {
            val: "提示",
            bg: "#0362fd"
        },
        ok: {
            val: "成功",
            bg: "#35aa47"
        },
        success: {
            val: "成功",
            bg: '#35aa47'
        }
    };

    return {
        blockUI: blockUI,
        growlUI: growlUI
    }

})();