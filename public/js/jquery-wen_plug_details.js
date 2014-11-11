/* 
 * JS Document for xxx
 * wen
 * copyright wen
 * email:yellowwen@126.com
 * Date: 2013-11-5
*/

(function($){
	
	$.fn.wen_plug_details = function(options){
		if(!window.Modernizr){alert("Modernizr.js没有加载");return false;}
		var defaultVal = {
			view_class:"details_3d_view",
			view_front_class:"details_3d_front",
			view_versa_class:"details_3d_versa",
			effects:"door1",
			//speed:1000,
			delay:2000,
			star_fn:"",						
			end_fn:""	
		};
		
		var obj = $.extend(defaultVal,options);
		
		return this.each(function(){
			var $this = $(this);
			var t,t1;
			var $details_3d = $this.find(".details_3d");
			var w = $details_3d.width(),h = $details_3d.height();
			var play = {
				door1_in:function(box){
					var $box_3d = box;
					if(!$box_3d.children().hasClass(obj.view_class)){
						$box_3d.css({"background-color":"#ccc","box-shadow":"inset 0 0 6px #000"});
						$box_3d.children().wrapAll('<div class="'+obj.view_front_class+'"></div>');
						$("."+obj.view_front_class).after('<div class="'+obj.view_versa_class+'"></div>');
						$box_3d.children().wrapAll('<div class="'+obj.view_class+'"></div>');
						$("."+obj.view_class).css({
							"height":h,
							"width":w,
							"position":"relative"
						});
						$("."+obj.view_front_class).css({
							"height":h,
							"width":w,
							"position":"absolute",
							"z-index":"101",
							"left":0,"top":0
						});
						$("."+obj.view_versa_class).css({
							"height":h,
							"width":w,
							"position":"absolute",
							"z-index":"100",
							"left":0,"top":0
						});
						if(typeof obj.star_fn == "function"){
							obj.star_fn($box_3d);
						}
					}
					clearTimeout(t);
					t=setTimeout(function(){
						var old_style = $box_3d.children("."+obj.view_class).attr("style");
                            old_style = !!old_style?old_style:"";
						$box_3d.children("."+obj.view_class).attr("style",old_style+" "+transformAll+': translate3d(0px, 0px, 0px) rotate3d(0, 1, 0, 180deg);');
					},obj.delay);
				},
				door1_out:function(box){
					var $box_3d = box;
					clearTimeout(t);
					var old_style = $box_3d.children("."+obj.view_class).attr("style");
                        old_style = !!old_style?old_style:"";
					$box_3d.children("."+obj.view_class).attr("style",old_style+" "+transformAll+': translate3d(0px, 0px, 0px) rotate3d(0, 1, 0, 0deg);');
				},
				door1_in_other:function(box){
					var $box_3d = box;
					if(!$box_3d.children().hasClass(obj.view_class)){
						$box_3d.css({"background-color":"#ccc","box-shadow":"inset 0 0 6px #000"});
						$box_3d.children().wrapAll('<div class="'+obj.view_front_class+'"></div>');
						$("."+obj.view_front_class).after('<div class="'+obj.view_versa_class+'"></div>');
						$box_3d.children().wrapAll('<div class="'+obj.view_class+'"></div>');
						$("."+obj.view_class).css({
							"height":h,
							"width":w,
							"position":"relative"
						});
						$("."+obj.view_front_class).css({
							"height":h,
							"width":w,
							"position":"absolute",
							"z-index":"101",
							"left":0,
							"top":0
						});
						$("."+obj.view_versa_class).css({
							"height":h,
							"width":w,
							"position":"absolute",
							"z-index":"100",
							"left":0,
							"top":0
						}).hide();
						if(typeof obj.star_fn == "function"){
							obj.star_fn($box_3d);
						}
					}
					
					clearTimeout(t);
					
					t=setTimeout(function(){
						var old_style = $box_3d.children("."+obj.view_class).children("."+obj.view_front_class).attr("style");
                            old_style = !!old_style?old_style:"";
						$box_3d.children("."+obj.view_class).children("."+obj.view_front_class).attr("style",old_style+" "+transformAll+': translate3d(0px, 0px, 0px) rotate3d(0, 1, 0, 90deg);height:'+h+'px;width:'+w+'px;position:absolute;z-index;101;left:0;top:0');
						setTimeout(function(){
							$box_3d.children("."+obj.view_class).children("."+obj.view_front_class).hide();
							$box_3d.children("."+obj.view_class).children("."+obj.view_versa_class).show().children().css({"bottom":"auto"});
							var old_style = $box_3d.children("."+obj.view_class).children("."+obj.view_versa_class).attr("style");
                                old_style = !!old_style?old_style:"";
							$box_3d.children("."+obj.view_class).children("."+obj.view_versa_class).attr("style",old_style+' '+transformAll+': translate3d(0px, 0px, 0px) rotate3d(0, 1, 0, 0deg);height:'+h+'px;width:'+w+'px;position:absolute;z-index;101;left:0;top:0;');
							
						},600);
						
					},obj.delay);
				},
				door1_out_other:function(box){
					var $box_3d = box;
					clearTimeout(t);
					var old_style = $box_3d.children("."+obj.view_class).children("."+obj.view_versa_class).attr("style");
                        old_style = !!old_style?old_style:"";
					$box_3d.children("."+obj.view_class).children("."+obj.view_versa_class).attr("style",old_style+' '+transformAll+': translate3d(0px, 0px, 0px) rotate3d(0, 1, 0, 90deg);height:'+h+'px;width:'+w+'px;position:absolute;z-index;101;left:0;top:0');
					/*
					if($box_3d.find("."+obj.view_versa_class).children().length > 0){
						$box_3d.find("."+obj.view_versa_class).css({"background-image":"none"});
					}*/
					setTimeout(function(){
						$box_3d.children("."+obj.view_class).children("."+obj.view_versa_class).hide();
						$box_3d.children("."+obj.view_class).children("."+obj.view_front_class).show();
						var old_style = $box_3d.children("."+obj.view_class).children("."+obj.view_front_class).attr("style");
                            old_style = !!old_style?old_style:"";
						$box_3d.children("."+obj.view_class).children("."+obj.view_front_class).attr("style",old_style+' '+transformAll+': translate3d(0px, 0px, 0px) rotate3d(0, 1, 0, 0deg);height:'+h+'px;width:'+w+'px;position:absolute;z-index;101;left:0;top:0');
					},600);
				},
				door2_in:function(box){
					var $box_3d = box;
					if(!$box_3d.children().hasClass(obj.view_class)){
						$box_3d.css({"background-color":"#ccc","box-shadow":"inset 0 0 6px #000"});
						$box_3d.children().wrapAll('<div class="'+obj.view_front_class+'"></div>');
						$("."+obj.view_front_class).after('<div class="'+obj.view_versa_class+'"></div>');
						$box_3d.children().wrapAll('<div class="'+obj.view_class+'"></div>');
						$("."+obj.view_class).css({"height":h,"width":w,"position":"relative"});
						$("."+obj.view_front_class).css({
							"height":h,
							"width":w,
							"position":"absolute",
							"z-index":"101",
							"left":0,
							"top":0
						});
						var old_style = $("."+obj.view_versa_class).attr("style");
                            old_style = !!old_style?old_style:"";
						$("."+obj.view_versa_class).attr("style",old_style+" "+transformAll+': translate3d(0px, 0px, 0px) rotate3d(0, 1, 0, 0deg);height:'+h+'px;width:'+w+'px;position:absolute;z-index;100;left:0;top:0;background-color:transparent');
						$('<div class="door_l"></div>').insertAfter("."+obj.view_versa_class).css({
							"height":h,
							"width":w/2-1,
							"border-right":"solid 1px #ccc",
							"background-color":"#fff",
							"position":"absolute",
							"z-index":"100",
							"left":"0",
							"top":"0",
							"font-size":"0"
						});
						$('<div class="door_r"></div>').insertAfter("."+obj.view_versa_class).css({
							"height":h,
							"width":w/2-1,
							"border-left":"solid 1px #ccc",
							"background-color":"#fff",
							"position":"absolute",
							"z-index":"100",
							"right":"0",
							"top":"0",
							"font-size":"0"
						});
						if(typeof obj.star_fn == "function"){
							obj.star_fn($box_3d);
						}
					}
					clearTimeout(t);
					$box_3d.find("div.door_l").css({
						"height":h,
						"width":w/2-1
					});
					$box_3d.find("div.door_r").css({
						"height":h,
						"width":w/2-1
					});
					t=setTimeout(function(){
						$box_3d.children("."+obj.view_class).children("."+obj.view_front_class).fadeOut(500,function(){
							$box_3d.find("div.door_l").animate({width:0},300);
							$box_3d.find("div.door_r").animate({width:0},300);
						});
					},obj.delay);
				},
				door2_out:function(box){
					var $box_3d = box;
					clearTimeout(t);
					$box_3d.find("div.door_l").stop(true,true).animate({width:w/2-1},200);
					$box_3d.find("div.door_r").stop(true,true).animate({width:w/2-1},200,function(){
						$box_3d.children("."+obj.view_class).children("."+obj.view_front_class).fadeIn(500);
					});
				},
				ud_in:function(box){
					var $box_3d = box;
					if(!$box_3d.children().hasClass(obj.view_class)){
						$box_3d.css({"background-color":"#ccc","box-shadow":"inset 0 0 6px #000"});
						$box_3d.children().wrapAll('<div class="'+obj.view_front_class+'"></div>');
						$("."+obj.view_front_class).after('<div class="'+obj.view_versa_class+'"></div>');
						$box_3d.children().wrapAll('<div class="'+obj.view_class+'"></div>');
						$("."+obj.view_class).css({"height":h,"width":w,"position":"relative"});
						$("."+obj.view_front_class).css({"height":h,"width":w});
						$("."+obj.view_versa_class).css({"height":h,"width":w,"position":"relative"});
						if(typeof obj.star_fn == "function"){
							obj.star_fn($box_3d);
						}
					}					
					clearTimeout(t);
					t=setTimeout(function(){
						$box_3d.children("."+obj.view_class).children("."+obj.view_versa_class).children().css({"bottom":"auto"});
						$box_3d.children("."+obj.view_class).children("."+obj.view_front_class).stop(true).animate({marginTop:"-198px"},500);						
					},obj.delay);
				},
				ud_out:function(box){
					var $box_3d = box;
					clearTimeout(t);
					$box_3d.children("."+obj.view_class).children("."+obj.view_front_class).stop(true).animate({marginTop:"0"},500);	
				}
			};
							
			$details_3d.mouseenter(function(){//鼠标移进
				if(obj.effects == "door1"){
					if(Modernizr.csstransforms3d){//判断是否支持CSS--3D样式，如果支持就用3D反转切换，不支持就上下切换
						//判断是否支持3D空间（IE10暂不支持）
						if(Modernizr.preserve3d){
							play.door1_in($(this));
						}else{//悲催的IE10只支持一半的3D，换个思路实现反转
							play.door1_in_other($(this));
						}
					}else{
						play.ud_in($(this));
					}
				}else if(obj.effects == "door2"){
					play.door2_in($(this));
				}
						
			}).mouseleave(function(){//鼠标离开
				if(obj.effects == "door1"){
					if(Modernizr.csstransforms3d){
						if(Modernizr.preserve3d){
							play.door1_out($(this));
						}else{
							play.door1_out_other($(this));
						}
					}else{
						play.ud_out($(this));
					}
				}else if(obj.effects == "door2"){
					play.door2_out($(this));
				}
			});
		});
		
	}
	//检测前缀
	function prefixStyle(style) {
		var dummyStyle = document.createElement('div').style,
			vendor = (function () {
				var vendors = 't,webkitT,MozT,msT,OT'.split(','),
					t,
					i = 0,
					l = vendors.length;
				for ( ; i < l; i++ ) {
					t = vendors[i] + 'ransform';
					if ( t in dummyStyle ) {
						return vendors[i].substr(0, vendors[i].length - 1);
					}
				}
				return false;
			})(),
			cssVendor = vendor ? '-' + vendor.toLowerCase() + '-' : '';
		if ( cssVendor === '' ) return style;
		//style = style.charAt(0).toUpperCase() + style.substr(1);
		return cssVendor + style;
	};
	
	// 还原样式前缀
	var transformAll = prefixStyle('transform'),
	transitionAll = prefixStyle('transition'),
	transformStyleAll = prefixStyle('transformStyle'),
	backfaceVisibilityAll = prefixStyle('backfaceVisibility'),
	perspectiveAll = prefixStyle('perspective');
	
})(jQuery);