$(function(){
    var page = 1;
    var say = false;
    var lastpage = false;
    var getData = true,postData = true;
    $(window).scroll(function(){
        if($(".home_content").length > 0){
            if(!!lastpage || !!say){return};
            var h = $("body").height()-$(window).height();
            if(!!h){
                var h_top = $(window).scrollTop();
                if(h-h_top < 100){
                    if(getData){
                        ajaxData();
                        getData = false;
                    }

                }
            }
        }
        if($(window).scrollTop() > $(window).height()*1.5){
            $("#gotop").fadeIn("slow");
        }else{
            $("#gotop").fadeOut("slow");
        }
    });
    /*--gotop--*/
    $("#gotop").click(function(){
        $(window).scrollTop('0');
        $(this).fadeOut("slow");
    });


    function ajaxData(){
        $.ajax({
            url:"?page="+(page+1),
            dataType:"json",
            success: function(json){
                var html_txt = [];
                $.each(json.posts,function(i,n){
                    var tt = data_txt(n);
                    html_txt.push(tt);
                });
                $(".home_content").append(html_txt.join(""));
                getData = true;
                page = page+1;
                lastpage = json.isLastPage;
            },
            error:function(){
                getData = true;
            }
        })
    }
    function data_txt(n) {
        var txt = "", tag = "", showall = "";
        var head_url = !!n.headico ? n.headico : "/images/head.gif";
        var comment_l = n.commentstotal? n.commentstotal : 0;
        var pv_l = n.pv ? n.pv : 0;
        var showall = '<div class="rfloat"><a class="show_all" data-url="/u/' + n._id + '">查看全文</a></div>';
        var d = new Date();
        d.setTime(n.time);
        var y = d.getFullYear();
        var m = d.getMonth() + 1;
        var date = d.getDate();
        if (date < 10) {
            date = "0" + date;
        }
        var time = y + '-' + m + '-' + date;
        var digest = [];
        if (n.digest.indexOf("__||__") > -1){
            digest = n.digest.split("__||__");
        }else{
            digest[0] = n.digest;
        }
        if(digest[1]){
            digest[1] = '<img src="'+digest[1]+'" alt="" />';
        }else{
            digest[1] = '';
        }
        txt = '<div class="log_box">\
                    <div class="log_time">\
                        <span>'+m+'-'+date+'</span>\
                    </div>\
                    <div class="log_time_ico">\
                        <div class="ico_arrow"></div>\
                    </div>\
                    <div class="log_box_module">\
                        <div class="log_box_body">\
                            <div class="log_box_details">\
                                <div class="log_details_t">\
                                    <div class="log_head_ico">\
                                        <a href="'+ n.name +'" title="'+ n.name +'">\
                                            <img src="'+ head_url +'" alt="头像" />\
                                            <p>'+n.name+'</p>\
                                        </a>\
                                    </div>\
                                    <h4>\
                                        <a href="">'+n.title+'</a>\
                                    </h4>\
                                    <p style="color:#ccc;">'+n.sort+'</p>\
                                    <p>\
                                        <small>'+time+'</small>\
                                    </p>\
                                </div>\
                                <div class="log_details_m">'+digest[0]+digest[1]+'</div>\
                                <div id="commentBox'+ n._id+'" class="log_comment_box">\
                                    <div class="comment_box_title">\
                                        <h3>评论：</h3>\
                                    </div>\
                                    <div class="comment_box_m"></div>\
                                    <div class="comment_box_b">\
                                        <form method="post" class="log_comment_data">\
                                            <ul class="ui_ul_input">\
                                                <li><label>姓名：</label><input class="form-control inlineblock" type="text" name="name" value="" /></li>\
                                                <li><label>邮箱：</label><input class="form-control inlineblock" type="text" name="email" value="" /></li>\
                                                <li><label class="lfloat">评论：</label><textarea name="content" class="form-control inlineblock"></textarea></li>\
                                                <li><label>验证码：</label><input class="codeIMG_txt form-control inlineblock" type="text" name="codeIMG" /><img class="commentCodeUrl CodeUrl" src="/images/demoCode.png" alt="" title="点击获取验证码" /></li>\
                                            </ul>\
                                            <div id="msg'+ n._id+'" class="comment_msg">数据发送中<img style="vertical-align: middle;height:3px" src="/images/ajax-loader.gif" alt="" /></div>\
                                            <div class="form_actions">\
                                                <button id="comment'+ n._id+'" type="submit" data-url="/getcomments/'+ n._id+'" class="btn send_comment">评论</button>\
                                            </div>\
                                        </form>\
                                    </div>\
                                </div>\
                                <div class="log_details_b clearfix">\
                                    <p class="info lfloat">\
                                        阅读：<span class="read_num">'+pv_l+'</span>&nbsp;|&nbsp;评论：<span class="comments_num">'+comment_l+'</span>\
                                    </p>'+ showall +'\
                                </div>\
                            </div>\
                        </div>\
                        <div class="log_box_arrow">\
                            <div class="log_box_arrow1"></div>\
                        </div>\
                    </div>\
            </div>';
        return txt;
    }
    /*--时间圈--*/
    $(document).on({
        "mouseenter":function() {
            if(!($(this).parent().next().find("div.log_head_ico").is(":animated"))){
                $(this).parent().next().find("div.log_head_ico").fadeIn("slow");
            }

        },
        "mouseleave":function(){
            $(this).parent().next().find("div.log_head_ico").fadeOut(3000);
        }
    },"div.ico_arrow");

    $(document).on({
        "mouseenter":function() {
            $(this).stop().fadeIn("slow");
        },
        "mouseleave":function(){
            $(this).fadeOut("slow");
        }
    },".home_content div.log_head_ico");

    /*--查看全文--*/
    $(document).on("click",".show_all",function(){
        $(this).hide().after('<div class="loading_data">数据获取中<img src="/images/ajax-loader.gif" height="3" alt="" /></div>');
        var get_url = $(this).attr("data-url");
        var $this = $(this);
        ajaxData_getOne(get_url,$this);
        return false;
    });
    function ajaxData_getOne(url,elem){
        $.ajax({
            url: url,
            success: function (json) {
                if(json.state){
                    elem.parents(".log_box_details").find("div.log_details_m").html(json.posts.post);
                    //elem.parent().remove();
                    var $pv = elem.parent().prev("p.info").find(".read_num");
                    $pv.text(parseInt($pv.text())+1);
                    if(json.posts.comments){
                        elem.next().remove();
                        elem.after('<a data-url="/getComments/'+json.posts._id+'" class="comments_all">查看评论</a>');
                    }else{
                        elem.next().remove();
                        elem.after('<a class="write_comment">发表评论</a>');
                    }
                }else{
                    if(json.msg){
                        elem.next().html(json.msg);
                        window.setTimeout(function(){
                            elem.show().next().remove();
                        },2000);
                    }
                }
            },
            error: function () {
                elem.next().html("服务器繁忙，稍后再试！");
                window.setTimeout(function(){
                    elem.show().next().remove();
                },2000);
            }
        });
    }


    /*--登录页--*/
    $(".login_instrl").height($(window).height()).width($(window).width());
    $(".show_instrl").wen_plug_details({
        effects:"door2",
        star_fn:function(elm){
            $('.power_btn').appendTo(elm.find(".details_3d_versa")).show();
        }
    });
    $('.power_btn').mouseup(function(){
        $(this).parents(".login_instrl").hide();
        $("body").css("background-color","#000");
        $(".login_box").css("top","-1000px").show();
        $(".login_box").animate({top:"100px"},1000);
    });
    $("#loginBtn").click(function(){
        $this = $(this);
        var email = $this.parents(".login_data").find("#email").val();
        var password = $this.parents(".login_data").find("#password").val();
        var codeIMG = $this.parents(".login_data").find("#codeIMG").val();
        var emailReg = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{1,6})$/;

        if(email == "" || password == "" || codeIMG == ""){
            $this.parents(".login_data").find(".login_msg").text("邮箱/密码/验证码 不能为空！").css({"visibility":"visible"});
            return false;
        }
        if(emailReg.test(email)){
            $this.parents(".login_data").find(".login_msg").html('正在登录<img style="vertical-align: middle;height:3px" src="/images/ajax-loader.gif" alt="" />').css({"visibility":"visible"});
            $this.prop("disbled",true);
            ajaxLogin();
        }else{
            $this.parents(".login_data").find(".login_msg").text("邮箱格式不正确！").css({"visibility":"visible"});
            return false;
        }
        return false;
    });
    function ajaxLogin(){
        $.ajax({
            type:"POST",
            url: "/login",
            data:$("form.login_data").serialize(),
            success: function (json) {
                if(!json.success){
                    $("form.login_data .login_msg").html(json.error).css("visibility","visible");
                    $(".codeUrl").trigger('click');
                }else{
                    location.href = "/admin";
                }
            },
            error: function () {
                alert("无法连接服务器！请稍后再试")
            }
        })
    }
    /*--登录验证码--*/
    $(document).on("click",".CodeUrl",function(){
        $(this).attr("src","/code/textjpg?"+new Date().getTime())
    });




    /*--发表评论--*/
    $(document).on("click","a.write_comment",function(){
        $(this).parents(".log_box_details").find("div.log_comment_box").show().css("background","none");
        $(this).parents(".log_box_details").find("div.comment_box_b").show();
        $(this).hide();
    });

    /*--评论--*/
    $(document).on("click","button.send_comment",function(){
        //var uid = $(this).parents(".log_box_details").find("a.uid").data("uid");
        var $this = $(this);
        var get_url = $(this).attr("data-url");
        var commentData = $(this).parents("form.log_comment_data").serialize();
        if($this.parents("form.log_comment_data").find("input[name='name']").val() == "" || $this.parents("form.log_comment_data").find("input[name='email']").val() == "" || $this.parents("form.log_comment_data").find("input[name='content']").val() == "" || $this.parents("form.log_comment_data").find("input[name='codeIMG']").val() == ""){
            $this.parent().prev(".comment_msg").css("visibility","visible").html('用户名/邮箱/评论内容/验证码 不能为空！');
            window.setTimeout(function(){
                $this.parent().prev(".comment_msg").css("visibility","hidden");
            },2000);
            return false;
        }
        $(this).parent().prev(".comment_msg").css("visibility","visible").html('数据发送中<img style="vertical-align: middle;height:3px" src="/images/ajax-loader.gif" alt="" />');
        $(this).prop("disabled",true);
        ajaxData_comments(get_url,$this,commentData);
        return false;
    });
    function ajaxData_comments(url,elem,commentData){
        $.ajax({
            type: "POST",
            url: url,
            data: commentData,
            success: function (json) {
                //var msg = '#msg'+_id;
                //var comment = '#comment'+_id;
                var comment_txt = "";
                if(!json.state){
                    elem.parent().prev(".comment_msg").html("评论失败！ "+json.msg);
                    elem.prop("disabled",false);
                }else{
                    var d = new Date();
                    d.setTime(json.comment.time);
                    var y = d.getFullYear();
                    var m = d.getMonth() + 1;
                    var date = d.getDate();
                    if (date < 10) {
                        date = "0" + date;
                    }
                    var time = y + '-' + m + '-' + date;
                    comment_txt = '<div class="comment_list">\
                                            <div class="comments_details_t">\
                                                <a class="head_ico" href="#">\
                                                    <img src="/images/head.gif" alt="" />\
                                                </a>\
                                                <a class="head_name" href="#">'+json.comment.name+'</a>\
                                                <span class="info">回复于 <span>'+time+'</span></span>\
                                            </div>\
                                            <div class="comments_details_m">'+json.comment.content+'</div>\
                                       </div>';
                    elem.parents(".log_box_details").find("div.comment_box_m").append(comment_txt);
                    elem.parent().prev(".comment_msg").html("评论成功！");
                    elem.parents(".log_box_details").find("span.comments_num").text(1+parseInt(elem.parents(".log_box_details").find("span.comments_num").text()));
                    elem.hide().prop("disabled",false).after('<button id="againComment'+json._id+'" type="button" class="btn">再次评论</button>');
                    var againID = "#againComment"+json._id;
                    $(againID).click(function(){
                        $(this).parents("form.log_comment_data").find("textarea").val("");
                        $(this).parents("form.log_comment_data").find(".codeIMG_txt").val("");
                        $(this).parents("form.log_comment_data").find(".CodeUrl").trigger('click');
                        $(this).remove();
                        elem.show();
                        elem.parent().prev(".comment_msg").css("visibility","hidden");
                    });
                }
            },
            error: function () {
                //var msg = '#msg'+_id;
                //var comment = '#comment'+_id;
                elem.parent().prev(".comment_msg").html("评论失败，请检查网络！");
                elem.prop("disabled",false);
            }
        })
    }

    /*--查看评论--*/
    $(document).on("click","a.comments_all",function() {
        //var uid = $(this).data("uid");
        var get_url = $(this).attr("data-url");
        var $this = $(this);
        $(this).parents(".log_box_details").find("div.log_comment_box").show().css({"height":"10em"});
        $(this).hide().after('<div class="loading_data">数据获取中<img src="/images/ajax-loader.gif" height="3" alt="" /></div>');
        ajaxData_getComment(get_url,$this);
        return false;
    });
    function ajaxData_getComment(url,elem){
        $.ajax({
            url: url,
            success: function (json) {
                //var commentBox = "#commentBox" + _id;
                var comment_txt = "",comment_array = [];
                if(!json.state){
                    //$(commentBox).append('<p class="error" style="padding:4em 0;text-align: center">数据获取失败，请稍后重试！</p>');
                    //$(commentBox).next("log_details_b").find("a.comments_all").show();
                    elem.next(".loading_data").html("数据获取失败，请稍后重试！ "+json.msg);
                    window.setTimeout(function(){
                        elem.show().next(".loading_data").remove();
                    },2000);
                }else{
                    $.each(json.comments.comments,function(i,n){
                        var d = new Date();
                        d.setTime(n.time);
                        var y = d.getFullYear();
                        var m = d.getMonth() + 1;
                        var date = d.getDate();
                        if (date < 10) {
                            date = "0" + date;
                        }
                        var time = y + '-' + m + '-' + date;
                        comment_txt = '<div class="comment_list">\
                                            <div class="comments_details_t">\
                                                <a class="head_ico" href="#">\
                                                    <img src="/images/head.gif" alt="" />\
                                                </a>\
                                                <a class="head_name" href="#">'+n.name+'</a>\
                                                <span class="info">回复于 <span>'+time+'</span></span>\
                                            </div>\
                                            <div class="comments_details_m">'+n.content+'</div>\
                                       </div>';
                        comment_array.push(comment_txt);
                    });
                    elem.parents(".log_box_details").find("div.log_comment_box").css({"height":"auto","background":"none"});
                    elem.parents(".log_box_details").find("div.comment_box_m").append(comment_array.join(""));
                    elem.next(".loading_data").remove();
                    elem.after('<a class="write_comment">发表评论</a>');
                }
            },
            error: function () {
                elem.next(".loading_data").html("服务器繁忙，稍后再试！");
                window.setTimeout(function(){
                    elem.show().next(".loading_data").remove();
                },2000);
            }
        })
    }

    /*--所有文章
    $("#archive_box").masonry({
        columnWidth: 200,
        itemSelector: '.archive_list'
    });
    --*/
    /*--分类文章--*/
    $("#select_sort").change(function(){
        var sort = $(this).val();
        var txt = sort=="all"?"全部":sort;
        $(".sort_box").empty().append('<h3>'+txt+'</h3>');
        $(".sort_box").append('<div class="loading_data">数据获取中<img src="/images/ajax-loader.gif" height="3" alt="" /></div>');
        ajaxData_getSort(sort);
    });
    function ajaxData_getSort(sort){
        $.ajax({
            url: "/sort/"+sort,
            success: function (json) {
                if(json.state){
                    $(".sort_box .loading_data").remove();
                    var t = "", h = [], ssort = $(".sort_box h3").text(), l=0;
                    $.each(json.posts,function(i,n){
                        var d = new Date();
                        d.setTime(n.time);
                        var y = d.getFullYear();
                        var m = d.getMonth() + 1;
                        var date = d.getDate();
                        if (date < 10) {
                            date = "0" + date;
                        }
                        var time = y + '-' + m + '-' + date;
                        if(ssort != n.sort){
                            h.push('<li><h4>'+n.sort+'</h4></li>');
                            ssort = n.sort;
                            l++;
                        }
                        t = '<li><a target="_blank" href="/article/'+n._id+'" title="'+n.title+'">'+n.title+'</a><span>'+time+'</span></li>';
                        h.push(t);
                    });
                    $(".sort_box h3").append("<span style='font-size: 12px;'>("+ (h.length-l)+")</span>");
                    if(h.length == 0){h[0] = "<li>此分类暂无文章！</li>"};
                    $(".sort_box").append("<ul>"+ h.join("")+"</ul>");
                }else{
                    $(".sort_box .loading_data").html(json.msg);
                    window.setTimeout(function(){
                        $(".sort_box .loading_data").remove();
                    },1000);
                }
            },
            error:function(){

            }
        })
    }

    /*--个人中心--*/
    /*生日*/
    /*$("#birthday").datepicker({
        //showOn: "button",
        //buttonImage: "images/calendar.gif",
        //buttonImageOnly: true,
        //buttonText:"选择日期",
        changeMonth: true,
        changeYear: true,
        dateFormat:'yy-mm-dd',
        yearRange: '1900:'+new Date().getFullYear(),
        //minDate:'1d',
        maxDate:'0d',
        showMonthAfterYear: true,
        showCurrentAtPos:0,
        dayNamesMin:['日', '一', '二', '三', '四', '五', '六'],
        monthNamesShort: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
    });

    var dates = $("#fworkTime,#tworkTime").datepicker({
        changeMonth: true,
        changeYear: true,
        //defaultDate : new Date(),
        dateFormat:'yy-mm-dd',
        yearRange: '1900:'+new Date().getFullYear(),
        //minDate:'1d',
        maxDate:'0d',
        showMonthAfterYear: true,
        showCurrentAtPos:0,
        dayNamesMin:['日', '一', '二', '三', '四', '五', '六'],
        monthNamesShort: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
        onSelect: function( selectedDate ) {
            if(this.id == "fworkTime"){
                var option = "minDate";
            }
            if(this.id == "tworkTime"){
                $(".currentWorkTime").prop("checked",false);
            }
            //var option = this.id == "fworkTime" ? "minDate" : "maxDate",
            var instance = $( this ).data( "datepicker" ),
            date = $.datepicker.parseDate(
                    instance.settings.dateFormat ||
                    $.datepicker._defaults.dateFormat,
                selectedDate, instance.settings );
            if(!!option){
                dates.not( this ).datepicker( "option", option, date );
            }
        }
    });*/

    var birthday = {
        elem: '#birthday',
        format: 'YYYY-MM-DD',
        min: laydate.now(), //设定最小日期为当前日期
        max: '2099-06-16', //最大日期
        istoday: false
    };
    var start = {
        elem: '#fworkTime',
        format: 'YYYY-MM-DD',
        min: laydate.now(), //设定最小日期为当前日期
        max: '2099-06-16', //最大日期
        istoday: false,
        choose: function(datas){
            end.min = datas; //开始日选好后，重置结束日的最小日期
            end.start = datas //将结束日的初始值设定为开始日
        }
    };
    var end = {
        elem: '#tworkTime',
        format: 'YYYY-MM-DD',
        min: laydate.now(),
        max: '2099-06-16',
        istoday: false,
        choose: function(datas){
            start.max = datas; //结束日选好后，重置开始日的最大日期
        }
    };
    var typedate = document.createElement('input');
    typedate.setAttribute('type', 'date');
    //浏览器不支持date类型
    if(typedate.type == 'text'){
        $("#birthday").length&&laydate(birthday);
        $("#fworkTime").length&&laydate(start);
        $("#tworkTime").length&&laydate(end);
    }

    /*城市联动
    $(".citysele").wen_plug_cityLinkage({
        //prov:"广东",
        //city:"广州",
        //dist:"天河区",
        fun:function(elem){
            var v = [];
            var $s = elem.parents(".citysele").find("select");
            $s.each(function(i,n){
                v.push($(this).val());
            });
            if(elem.parents(".citysele").get(0).id == "hometown"){
                $("#addressHome").val(v.join("_"));
            }else{
                $("#addressReside").val(v.join("_"));
            }
        }
    });*/
    /*--基本资料保存--*/
    $('#basicData').ajaxForm({
        beforeSubmit:function(formData, jqForm, options){
            jqForm.find("#sendBasicData").prop("disabled",true);
            jqForm.find(".send_msg").css("visibility","visible").html('数据保存中<img src="/images/ajax-loader.gif" height="3" alt="" />');
        },
        success:function(json, statusText, xhr, $form){
            if(!!json.succeed){
                $form.find(".send_msg").html("保存成功！");
                window.setTimeout(function(){
                    $form.find("#sendBasicData").prop("disabled",false);
                    $form.find(".send_msg").css("visibility","hidden");
                },3000)
            }else{
                $form.find(".send_msg").html("保存失败！");
                window.setTimeout(function(){
                    $form.find("#sendBasicData").prop("disabled",false);
                    $form.find(".send_msg").css("visibility","hidden");
                },3000)
            }
        },
        error:function(){
            $('#basicData').find(".send_msg").html("保存失败，稍后重试！");
            window.setTimeout(function(){
                $('#basicData').find("#sendBasicData").prop("disabled",false);
                $('#basicData').find(".send_msg").css("visibility","hidden");
            },3000)
        }
    });

    /*--教育背景保存--*/
    $('#educationData').ajaxForm({
        beforeSubmit:function(formData, jqForm, options){
            jqForm.find("#sendEducationData").prop("disabled",true).html('数据保存中<img src="/images/ajax-loader.gif" height="3" alt="" />');
        },
        success:function(json, statusText, xhr, $form){
            if(!!json.succeed){
                $form.find("#sendEducationData").html("保存成功！");
                window.setTimeout(function(){
                    $form.find("#sendEducationData").prop("disabled",false).html("保&nbsp;存");
                },3000)
            }else{
                $form.find("#sendEducationData").html("保存成功！");
                window.setTimeout(function(){
                    $form.find("#sendEducationData").prop("disabled",false).html("保&nbsp;存");
                },3000)
            }
        },
        error:function(){
            $('#educationData').find("#sendEducationData").html("保存失败！");
            window.setTimeout(function(){
                $('#educationData').find("#sendEducationData").prop("disabled",false).html("保&nbsp;存");
            },3000)
        }
    });

    /*--工作信息保存--*/
    $('#workData').ajaxForm({
        beforeSubmit:function(formData, jqForm, options){
            jqForm.find("#sendWorkData").prop("disabled",true).html('数据保存中<img src="/images/ajax-loader.gif" height="3" alt="" />');
        },
        success:function(json, statusText, xhr, $form){
            if(!!json.succeed){
                $form.find("#sendWorkData").html("保存成功！");
                window.setTimeout(function(){
                    $form.find("#sendWorkData").prop("disabled",false).html("保&nbsp;存");
                },3000)
            }else{
                $form.find("#sendWorkData").html("保存失败！");
                window.setTimeout(function(){
                    $form.find("#sendWorkData").prop("disabled",false).html("保&nbsp;存");
                },3000)
            }
        },
        error:function(){
            $('#workData').find("#sendWorkData").html("保存失败！");
            window.setTimeout(function(){
                $('#workData').find("#sendWorkData").prop("disabled",false).html("保&nbsp;存");
            },3000)
        }
    });

    /*--修改密码--*/
    $('#passData').ajaxForm({
        beforeSubmit:function(formData, jqForm, options){
            jqForm.find("#sendPassData").prop("disabled",true);
            if($("#oldPassword").val() == ""){
                jqForm.find(".send_msg").css("visibility","visible").html('请输入旧密码！');
                window.setTimeout(function(){
                    $("#sendPassData").prop("disabled",false);
                    jqForm.find(".send_msg").css("visibility","hidden");
                },2000);
                return false;
            }
            if($("#newPassword").val() == "" && $("#newPassword1").val() == ""){
                jqForm.find(".send_msg").css("visibility","visible").html('请输入新密码！');
                window.setTimeout(function(){
                    $("#sendPassData").prop("disabled",false);
                    jqForm.find(".send_msg").css("visibility","hidden");
                },2000);
                return false;
            }
            if($("#newPassword").val() != $("#newPassword1").val()){
                jqForm.find(".send_msg").css("visibility","visible").html('两次输入的新密码不一致！');
                window.setTimeout(function(){
                    $("#sendPassData").prop("disabled",false);
                    jqForm.find(".send_msg").css("visibility","hidden");
                },2000);
                return false;
            }
            jqForm.find(".send_msg").css("visibility","visible").html('数据保存中<img src="/images/ajax-loader.gif" height="3" alt="" />');
        },
        success:function(json, statusText, xhr, $form){
            if(!!json.succeed){
                $form.find(".send_msg").html(json.succeedMsg);
                window.setTimeout(function(){
                    $form.find("#sendPassData").prop("disabled",false);
                    $form.find(".send_msg").css("visibility","hidden");
                },3000)
            }else{
                $form.find(".send_msg").html(json.succeedMsg);
                window.setTimeout(function(){
                    $form.find("#sendPassData").prop("disabled",false);
                    $form.find(".send_msg").css("visibility","hidden");
                },3000)
            }
        },
        error:function(){
            $('#passData').find(".send_msg").html("保存失败，稍后重试！");
            window.setTimeout(function(){
                $('#passData').find("#sendPassData").prop("disabled",false);
                $('#passData').find(".send_msg").css("visibility","hidden");
            },3000)
        }
    });

    /*--忘记密码--*/
    $('#forgetData').ajaxForm({
        beforeSubmit:function(formData, jqForm, options){
            var emailReg = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{1,6})$/;
            var email = $("input[name='email']").val();
            jqForm.find("#sendForgetData").prop("disabled",true);
            if(email == "" || $("input[name='code']").val() == ""){
                jqForm.find("#sendForgetData").html('邮箱/验证码不能为空');
                window.setTimeout(function(){
                    jqForm.find("#sendForgetData").html("确定").prop("disabled",false);
                },2000);
                return false;
            }
            if(!emailReg.test(email)){
                jqForm.find("#sendForgetData").html('邮箱格式不正确');
                window.setTimeout(function(){
                    jqForm.find("#sendForgetData").html("确定").prop("disabled",false);
                },2000);
                return false;
            }
            jqForm.find("#sendForgetData").html('数据提交中<img src="/images/ajax-loader.gif" height="3" alt="" />');
        },
        success:function(json, statusText, xhr, $form){
            //iframe提交时返回的只能是字符串，将字符串转json
            if(typeof json == "string"){
                json = eval('('+json+')');
            }
            if(!!json.state){
                $form.find("#sendForgetData").html("邮件已发送！");
                window.setTimeout(function(){
                    window.location.href = "http://"+json.email;
                },3000)
            }else{
                $form.find("#sendForgetData").html("数据提交失败！");
                window.setTimeout(function(){
                    $form.find("#sendForgetData").html("确定").prop("disabled",false);
                },3000)
            }
        },
        error:function(){
            $("#sendForgetData").html("数据提交失败！");
            window.setTimeout(function(){
                $("#sendForgetData").html("确定").prop("disabled",false);
            },3000)
        }
    });
    /*--重置密码--*/
    $('#resetPass').ajaxForm({
        beforeSubmit:function(formData, jqForm, options){
            var p = $("input[name='password']").val(),
                p1 = $("input[name='password1']").val();
            jqForm.find("#sendForgetData").prop("disabled",true);
            if(p == "" || p1 == ""){
                jqForm.find("#sendForgetData").html('密码不能为空');
                window.setTimeout(function(){
                    jqForm.find("#sendForgetData").html("确定").prop("disabled",false);
                },2000);
                return false;
            }
            if(p != p1){
                jqForm.find("#sendForgetData").html('两次输入的密码不一致！');
                window.setTimeout(function(){
                    jqForm.find("#sendForgetData").html("确定").prop("disabled",false);
                },2000);
                return false;
            }
            jqForm.find("#sendForgetData").html('数据提交中<img src="/images/ajax-loader.gif" height="3" alt="" />');
        },
        success:function(json, statusText, xhr, $form){
            //iframe提交时返回的只能是字符串，将字符串转json
            if(typeof json == "string"){
                json = eval('('+json+')');
            }
            if(!!json.state){
                $form.find("#sendForgetData").html("修改成功！");
                window.setTimeout(function(){
                    window.location.href = "/login";
                },3000)
            }else{
                $form.find("#sendForgetData").html("数据提交失败！");
                window.setTimeout(function(){
                    $form.find("#sendForgetData").html("确定").prop("disabled",false);
                },3000)
            }
        },
        error:function(){
            $("#sendForgetData").html("数据提交失败！");
            window.setTimeout(function(){
                $("#sendForgetData").html("确定").prop("disabled",false);
            },3000)
        }
    });

    /*--头像上传--*/
    $('#headData').ajaxForm({
        beforeSubmit:function(formData, jqForm, options){
            jqForm.find("#sendImg").prop("disabled",true);
            if($("#setHeadIco").val() == ""){
                jqForm.find("#sendImg").html('请选择图片');
                window.setTimeout(function(){
                    jqForm.find("#sendImg").html("保存头像").prop("disabled",false);
                },2000)
                return false;
            }
            jqForm.find("#sendImg").html('图像上传中<img src="/images/ajax-loader.gif" height="3" alt="" />');
        },
        success:function(json, statusText, xhr, $form){
            //iframe提交时返回的只能是字符串，将字符串转json
            if(typeof json == "string"){
                json = eval('('+json+')');
            }
            if(!!json.state){
                $form.find("#sendImg").html("保存成功！");
                $(".currentHeadIco_show img").attr("src",json.url);
                window.setTimeout(function(){
                    $form.find("#sendImg").html("保存头像").prop("disabled",false);
                },3000)
            }else{
                $form.find("#sendImg").html(json.msg);
                window.setTimeout(function(){
                    $form.find("#sendImg").html("保存头像").prop("disabled",false);
                },3000)
            }
        },
        error:function(){
            $("#sendImg").html("保存失败！");
            window.setTimeout(function(){
                $("#sendImg").html("保存头像").prop("disabled",false);
            },3000)
        }
    });






    // 创建变量(在这个范围) API、图像大小
    var jcrop_api,
        boundx,
        boundy,

    // 获取预览节点
        $preview = $('#clipHead'),
        $pcnt = $('#newHeadIcoShow'),
        $pimg = $('#newHeadImg'),

        xsize = $pcnt.width(),
        ysize = $pcnt.height();
    if($("#clipHead")&&$("#clipHead").length){
        var imgsrc = $("#clipHead").attr("src");
        var headico = new Image();
        headico.onload = function(){
            clipPIC();
        };
        headico.onerror = function(){
            clipPIC();
        };
        headico.src = imgsrc;
    }
    function clipPIC(){
        $("#clipHead").Jcrop({
            minSize:[80,80],
            //maxSize:[160,160],
            boxWidth: 400,
            boxHeight: 225,
            setSelect:   [ 0, 0, 80, 80 ],//可在回调中设置
            onChange: updatePreview,
            onSelect: updatePreview,
            aspectRatio: xsize / ysize
        },function(){
            // 获得真实的图像尺寸(样式定义后的尺寸，如display:none;则获取不到样式设置的尺寸，会取原始尺寸)
            var bounds = this.getBounds();
            boundx = bounds[0];
            boundy = bounds[1];
            jcrop_api = this;

            //在回调中设置选框效果更好
            //jcrop_api.animateTo([boundx *.5-65,boundy *.5-65,boundx *.5+65,boundy *.5+65]);
            //var cc = jcrop_api.tellSelect();
            //updatePreview(cc);
        });
    }

    function updatePreview(c){
        if (parseInt(c.w) > 0){
            var rx = xsize / c.w;
            var ry = ysize / c.h;

            $pimg.css({
                width: Math.round(rx * boundx) + 'px',
                height: Math.round(ry * boundy) + 'px',
                marginLeft: '-' + Math.round(rx * c.x) + 'px',
                marginTop: '-' + Math.round(ry * c.y) + 'px'
            });
            $('#x1').val(Math.round(c.x));
            $('#y1').val(Math.round(c.y));
            $('#x2').val(Math.round(c.x2));
            $('#y2').val(Math.round(c.y2));
            $('#w').val(Math.round(c.w));
            $('#h').val(Math.round(c.h));
            $(".newHeadMsg_w").text(Math.round(c.w));
            $(".newHeadMsg_h").text(Math.round(c.h));
        }
    };

    $("input.imitate").change(function(evt){
        var showElem = "#clipHead,#newHeadImg";
        fileupload($(this)[0],evt,showElem);
    });
    function fileupload(file_obj,evt,showElem){
        if(!file_obj.value){ //file_obj.value 经过处理后的路径
            return false;
        }
        //var file2 = file_obj.getAsDataURL();
        if(evt.target.files){
            var files = evt.target.files;
            var file = files[0];
            var output = [];
            var src_img = [];
        }
        var output = [];
        var src_img = [];
        var allowSuffix="jpg,bmp,gif,png,jpeg";//.jpg,.bmp,.gif,.png,允许上传文件的后缀名
        var suffix=file_obj.value.substring(file_obj.value.lastIndexOf(".")+1).toLowerCase();//截取文件后缀名
        var browserVersion= window.navigator.userAgent.toUpperCase();//浏览器版本信息
        //判断是否选取了图片格式的文件
        if(allowSuffix.indexOf(suffix)>-1){

            //现代浏览器，支持html5 FILE api
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                //判断文件类型，低端浏览器不支持，以外层的判断即可
                if(file.type.indexOf("image") === -1){
                    alert('"' + file.name + '"' + ' 不是图片或不支持该格式!');
                    return false;
                }
                //实例化file reader对象
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function(e) {
                    window.URL = window.URL || window.webkitURL;
                    if(window.URL){
                        //现代浏览器直接用URL
                        $(showElem).attr("src",window.URL.createObjectURL(file));

                        jcrop_api.setImage(window.URL.createObjectURL(file), function () {
                            var bounds = this.getBounds();
                            boundx = bounds[0];
                            boundy = bounds[1];
                            var cc = this.tellSelect();
                            if (parseInt(cc.w) > 0) {
                                var rxx = xsize / cc.w;
                                var ryy = ysize / cc.h;
                                $pimg.css({
                                    width: Math.round(rxx * boundx) + 'px',
                                    height: Math.round(ryy * boundy) + 'px',
                                    marginLeft: '-' + Math.round(rxx * cc.x) + 'px',
                                    marginTop: '-' + Math.round(ryy * cc.y) + 'px'
                                });
                            }
                        });
                    }else{
                        //读取的内容base64来当路径如opera浏览器
                        $(showElem).attr("src",e.target.result);
                        jcrop_api.setImage(e.target.result, function () {
                            var bounds = this.getBounds();
                            boundx = bounds[0];
                            boundy = bounds[1];
                            var cc = this.tellSelect();
                            if (parseInt(cc.w) > 0) {
                                var rxx = xsize / cc.w;
                                var ryy = ysize / cc.h;
                                $pimg.css({
                                    width: Math.round(rxx * boundx) + 'px',
                                    height: Math.round(ryy * boundy) + 'px',
                                    marginLeft: '-' + Math.round(rxx * cc.x) + 'px',
                                    marginTop: '-' + Math.round(ryy * cc.y) + 'px'
                                });
                            }
                        });
                    }
                };

                //ie6直接赋值
            }else if(browserVersion.indexOf("MSIE 6.0")>-1){
                $(showElem).attr("src",file_obj.value);
                jcrop_api.setImage(file_obj.value, function () {
                    var bounds = this.getBounds();
                    boundx = bounds[0];
                    boundy = bounds[1];
                    var cc = this.tellSelect();
                    if (parseInt(cc.w) > 0) {
                        var rxx = xsize / cc.w;
                        var ryy = ysize / cc.h;
                        $pimg.css({
                            width: Math.round(rxx * boundx) + 'px',
                            height: Math.round(ryy * boundy) + 'px',
                            marginLeft: '-' + Math.round(rxx * cc.x) + 'px',
                            marginTop: '-' + Math.round(ryy * cc.y) + 'px'
                        });
                    }
                });
                //ie7\8\9由于安全限制，使用滤镜
            }else if(browserVersion.indexOf("MSIE 7.0")>-1 || browserVersion.indexOf("MSIE 8.0")>-1 || browserVersion.indexOf("MSIE 9.0")>-1){
                jcrop_api.destroy();
                file_obj.select();
                $(file_obj).siblings().focus();//IE9如果让file控件得到焦点的话会拒绝访问，所以让另一个元素取得焦点
                var path = document.selection.createRange().text;//得到绝对路径
                $pcnt.css("text-align","left");
                $pimg.css({"vertical-align":"top","text-align":"left","line-height":"normal","display":"inline-block","filter":"progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + path + "')"});

                if($("#fakePimg").length <= 0){
                    $pimg.after('<span id="fakePimg"></span>');
                }
                if($("#fakePreview").length <= 0){
                    $preview.hide().after('<span id="fakePreview"></span>');
                }

                $("#fakePimg,#fakePreview").removeAttr("style");
                $("#fakePreview").css({"vertical-align":"middle","display":"inline-block","filter":"progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src='" + path + "')"});

                setTimeout(function(){
                    var v_width = $pimg.width(),v_height = $pimg.height();
                    var wh = clacImgZoomParam( 400, 225, v_width, v_height );
                    $("#fakePreview").css({"width":wh.width,"height":wh.height});
                    $pimg.hide();
                    $("#fakePimg").css({"vertical-align":"top","text-align":"left","line-height":"normal","display":"inline-block","filter":"progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + path + "')"});

                    $("#fakePreview").Jcrop({
                        minSize:[80,80],
                        //maxSize:[160,160],
                        //boxWidth: 400,
                        //boxHeight: 225,
                        trueSize: [v_width,v_height],
                        setSelect:   [ 0, 0, 80, 80 ],
                        onChange: updatePreview1,
                        onSelect: updatePreview1,
                        aspectRatio: xsize / ysize
                    },function(){
                        // 获得真实的图像尺寸(样式定义后的尺寸，如display:none;则获取不到样式设置的尺寸，会取原始尺寸)
                        //var bounds = this.getBounds();
                        boundx = v_width;
                        boundy = v_height;
                        jcrop_api = this;
                        var cc = this.tellSelect();
                        if (parseInt(cc.w) > 0) {
                            var rxx = xsize / cc.w;
                            var ryy = ysize / cc.h;
                            $("#fakePimg").css({
                                width: Math.round(rxx * boundx) + 'px',
                                height: Math.round(ryy * boundy) + 'px',
                                marginLeft: '-' + Math.round(rxx * cc.x) + 'px',
                                marginTop: '-' + Math.round(ryy * cc.y) + 'px',
                                filter:"progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src='" + path + "')"
                            });
                        }
                    });
                    function updatePreview1(c){
                        if (parseInt(c.w) > 0){
                            var rx = xsize / c.w;
                            var ry = ysize / c.h;

                            $("#fakePimg").css({
                                width: Math.round(rx * boundx) + 'px',
                                height: Math.round(ry * boundy) + 'px',
                                marginLeft: '-' + Math.round(rx * c.x) + 'px',
                                marginTop: '-' + Math.round(ry * c.y) + 'px'
                            });
                            $('#x1').val(Math.round(c.x));
                            $('#y1').val(Math.round(c.y));
                            $('#x2').val(Math.round(c.x2));
                            $('#y2').val(Math.round(c.y2));
                            $('#w').val(Math.round(c.w));
                            $('#h').val(Math.round(c.h));
                            $(".newHeadMsg_w").text(Math.round(c.w));
                            $(".newHeadMsg_h").text(Math.round(c.h));
                        }
                    };

                },500);

                function clacImgZoomParam( maxWidth, maxHeight, width, height ){
                    var param = { width:width,height:height};
                    if( width>maxWidth || height>maxHeight ){
                        rateWidth = width / maxWidth;
                        rateHeight = height / maxHeight;
                        if( rateWidth > rateHeight ){
                            param.width =  maxWidth;
                            param.height = height /rateWidth;
                        }else{
                            param.width = width / rateHeight;
                            param.height = maxHeight;
                        }
                    }
                    return param;
                }

                //火狐7以下
            }else if(!!(window.navigator.userAgent.toLowerCase().match(/firefox\/([\d.]+)/)) && parseFloat(window.navigator.userAgent.toLowerCase().match(/firefox\/([\d.]+)/)[1]) < 7){
                $(showElem).attr("src", file.getAsDataURL());

                //其它未知
            }else{
                $(showElem).attr("src",file_obj.value);
            };
        //如果不是图片文件
        }else{
            alert("仅支持"+allowSuffix+"为后缀名的文件!");
            //清空选中文件
            file_obj.value="";
            if(browserVersion.indexOf("MSIE 7.0")>-1 || browserVersion.indexOf("MSIE 8.0")>-1){
                file_obj.select();
                document.selection.clear();
            }
            file_obj.outerHTML=file_obj.outerHTML;
        };

  };



});
function check_img(elem) {
    if (!elem.value) { // file_obj.value 经过处理后的路径
        return false;
    }
    var allowSuffix = "jpg,bmp,gif,png,jpeg";// .jpg,.bmp,.gif,.png,允许上传文件的后缀名
    var suffix = elem.value.substring(elem.value.lastIndexOf(".") + 1)
        .toLowerCase();// 截取文件后缀名
    var browserVersion = window.navigator.userAgent.toUpperCase();// 浏览器版本信息

    // 判断是否选取了图片格式的文件
    if (allowSuffix.indexOf(suffix) > -1) {
        return true;
    } else {// 如果不是图片文件
        alert("仅支持" + allowSuffix + "为后缀名的文件!");
        // 清空选中文件
        elem.value = "";
        if (browserVersion.indexOf("MSIE 7.0") > -1
            || browserVersion.indexOf("MSIE 8.0") > -1) {
            elem.select();
            document.selection.clear();
        }
        elem.outerHTML = elem.outerHTML;
        return false;
    };
}
