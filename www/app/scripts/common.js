window.isPC = (function () {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false; break;
        }
    }
    return flag;

})();

//nav
(function(){
    var path = window.location.pathname;
    $("#nav").find('li').each(function(){
        var curLi = $(this);
        if (curLi.children('a').attr('href') == path){
            $(this).addClass('active').attr('data-cur', 'on');
            $(this).parents('li').addClass('active').attr('data-cur', 'on');
        }
        if (this.parentNode.id != "nav") return;
        curLi.hover(function(){
            $(this).addClass('active');
            $(this).children('ul').show(0).stop().animate({"top":"-10px","opacity": "1"}, 300);
        }, function(){
            $(this).children('ul').stop().animate({"top":"-40px","opacity": "0"}, 300, function(){
                $(this).hide(0);
            });
            if ($(this).attr('data-cur') == 'on') return;
            $(this).removeClass('active');
        });
    });
})();

(function(){


    if (!window.isPC && $(window).width()<980){
        document.getElementById('nav').className = 'mobNav';
        var switchNav = $('<a id="menu-btn"></a>');
        $('.container', '#header').append(switchNav);
        $("#menu-btn").click(function(){
            $("#nav").slideToggle(300);
        })
    }

})();

var Form = (function(){
    function Form(root, option){
        this.root = $(root);
        var opt = $.extend({}, Form.setting, option);
        this.submitBtn = this.root.find(opt.submitBtn);
        this.child = $(opt.child.join(','));
        this.verify = [];
        this.bindEvent();
        this.messageElem = $("#jobMessage");
        this.mask = this.root.next('.form-mask');
        this.boxHeight;
        this.maskInit = false;
    }

    Form.prototype = {
        constructor: Form,
        bindEvent: function(){
            var root = this;
            root.submitBtn.click(function(e){
                e.preventDefault();
                if (root.validate()){
                    root.submit();
                }
            });
            root.child.each(function(index){
                if (this.type == "file"){
                    root.verify[index] = true;
                    $(this).change(function(){
                        var fileReg = /\.(doc|docx|wps|ppt|pptx|txt|md|html|pdf|jpg|jpeg|png|gif)$/gi;
                        if (this.value.length>0 && !fileReg.test(this.value)){
                            $(this).siblings('.help-error').show();
                            $(this).siblings('.help-success').hide();
                            root.verify[index] = false;
                        }else{
                            $(this).siblings('.help-error').hide();
                            $(this).siblings('.help-success').show();
                            root.verify[index] = true;
                        }
                        root.checkSubmit();
                    });
                }else{
                    root.verify[index] = !($(this).attr('data-require') == "true");

                    $(this).focus(function(){
                        $(this).siblings('.help-inline').show();
                        $(this).siblings('.help-require').hide();
                        $(this).siblings('.help-error').hide();
                        $(this).siblings('.help-success').hide();
                        $(this).siblings('.help-disabled-html').hide();
                    }).blur(function(){
                        $(this).siblings('.help-inline').hide();
                        if ($(this).attr('data-require') == "true" && trim(this.value).length==0){
                            $(this).siblings('.help-require').show();
                            root.verify[index] = false;
                        }else{
                            var maxLength = $(this).attr('data-maxLength'),
                                disableHtml = $(this).attr('data-disable-html'),
                                reg = new RegExp($(this).attr("data-reg"), 'gi'),
                                val = trim(this.value);
                            if ((maxLength && val.length>maxLength)||(reg && !reg.test(val))){
                                $(this).siblings('.help-error').show();
                                root.verify[index] = false;
                            }else{
                                if (disableHtml == "true"){
                                    var htmlReg = /<\s*(\w)+\s*[^\/>]*\/?>/gi;
                                    if (htmlReg.test(val)){
                                        $(this).siblings('.help-disabled-html').show();
                                        root.verify[index] = false;
                                    }else{
                                        $(this).siblings('.help-success').show();
                                        root.verify[index] = true;
                                    }
                                }else{
                                    $(this).siblings('.help-success').show();
                                    root.verify[index] = true;
                                }
                            }
                        }
                        root.checkSubmit();
                    });
                }
            })
        },
        getValues: function(){
            var root = this,
                val = {},
                children = root.child;
            children.each(function(){
                if (this.name && this.value){
                    val[this.name] = this.value;
                }
            });
            return val;
        },
        submit: function(){
            var root = this,
                rootElem = this.root;
            rootElem.ajaxSubmit({
                beforeSubmit: function(){
                    root.loading(true);
                },
                success: function(data){
                    root.message(data.msg);
                    root.loading(false);
                }
            });
        },
        loading: function(flag){
            var root = this;
            if (!this.maskInit){
                this.boxHeight = this.root.height();
                this.mask.height(this.boxHeight);
            }
            if (flag){
                this.mask.css('margin-top', -this.boxHeight-20+"px");
                this.mask.show();
                this.mask.fadeIn(300);
            }else{
                this.mask.fadeOut(500, function(){
                    root.mask.css('margin-top', 0);
                    root.mask.hide();
                });
            }
        },
        message: function(msg){
            var root = this;
            this.messageElem.text(msg);
            this.messageElem.show(300, function(){
                setTimeout(function(){
                    root.messageElem.hide(200);
                },2000);
            });
        },
        checkSubmit: function(){
            if (this.validate()){
                this.submitBtn.removeClass('disabled');
                this.submitBtn[0].disabled = false;
            }else{
                this.submitBtn.addClass('disabled');
                this.submitBtn[0].disabled = true;
            }
        },
        validate: function(){
            var flag = true;
            for (var i=0;i<this.verify.length;i++){
                if (!this.verify[i]){
                    flag = false;
                    break;
                }
            }
            return flag;
        }
    };

    Form.setting = {
        child: ['input', 'select', 'textarea'],
        submitBtn: "button[type='submit']"
    };

    return Form;
})();

var trim = (function(){
    if (String.prototype.trim){
        return function(string){
            return string.trim();
        }
    }else{
        return function(string){
            return string.replace('/^\s*|\s*$/gi', '');
        }
    }
})();
