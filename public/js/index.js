function resizeStart(){var i=$(".start-screen").outerWidth(),t=128*Math.ceil(i/128);console.log("original: "+i),console.log("rounded: "+t),$(".start-screen").css({width:t})}function toggleStart(i){$(".start-menu-fade").fadeToggle(500),$(".start-menu").fadeToggle(250).toggleClass("start-menu--open"),$(".taskbar__item--start").toggleClass("start--open")}$(window).load(function(){$(".start-screen").masonry({itemSelector:".masonry-item",columnWidth:128}),$(".start-menu").hide().css("opacity",1)}),$(function(){}),$(function(){var i=1,t=$(window).height()-48,e=$(window).width();function s(t){var e=$(this).data("window"),s=$('.window[data-window="'+e+'"]'),a=$('.taskbar__item[data-window="'+e+'"]');if(t.preventDefault(),$(".taskbar__item").removeClass("taskbar__item--active"),s.is(":visible"))if(s.hasClass("window--active")){if($(s).toggleClass("window--minimized"),!s.hasClass("window--minimized")){$(s).height(),$(s).width(),$(s).position().top,$(s).position().left;$(".window").removeClass("window--active"),$(s).addClass("window--active").css({"z-index":i++}),$(a).addClass("taskbar__item--active")}}else $(".window").removeClass("window--active"),$(s).addClass("window--active").removeClass("window--minimized").css({"z-index":i++}),$(a).addClass("taskbar__item--active");else $(".window").removeClass("window--active"),$('.window[data-window="'+e+'"]').css({"z-index":i++}).addClass("window--active").show(),setTimeout(function(){$('.window[data-window="'+e+'"]').removeClass("window--opening")},500),$(a).addClass("taskbar__item--active").addClass("taskbar__item--open")}$(window).resize(function(){t=$(window).height()-48,e=$(window).width()}),$(function(){$(".window:visible").each(function(){var i=$(this).data("window");$('.taskbar__item[data-window="'+i+'"]').addClass("taskbar__item--open")}),$(".window:hidden").each(function(){$(this).addClass("window--opening")})}),$(function(){var t=$(".window:visible").not(".window--minimized").first(),e=$(t).data("window");$(t).addClass("window--active").css({"z-index":i++}),$('.taskbar__item[data-window="'+e+'"]').addClass("taskbar__item--active")}),$(".window").click(function(t){$(this).is(".window--active")||$(".window").removeClass("window--active"),$(this).addClass("window--active"),$(this).css({"z-index":i++});var e=$(this).data("window"),s=$('.taskbar__item[data-window="'+e+'"]');$(".window__close").is(t.target)||0!==$(".window__close").has(t.target).length||$(".window__minimize").is(t.target)||0!==$(".window__minimize").has(t.target).length||($(".taskbar__item").removeClass("taskbar__item--active"),$(s).addClass("taskbar__item--active"))}),$(".window").resizable({handles:"n,ne,e,se,s,sw,w,nw",stop:function(){$(this).height(),$(this).width(),$(this).position().top,$(this).position().left}}),$(".window").draggable({handle:".window__titlebar",stop:function(){$(this).height(),$(this).width(),$(this).position().top,$(this).position().left},start:function(t,e){var s=t.pageX+"px";console.log(s),$(".window").removeClass("window--active"),$(this).addClass("window--active"),$(this).css({"z-index":i++}),$(this).hasClass("window--maximized")&&$(this).removeClass("window--maximized").css({height:initialHeight,width:initialWidth,top:0,left:s});var a=$(this).data("window"),n=$('.taskbar__item[data-window="'+a+'"]');$(".taskbar__item").removeClass("taskbar__item--active"),$(n).addClass("taskbar__item--active")}}),$(".taskbar__item").click(s),$(".start-menu__recent li a").click(s),$(".start-screen__tile").click(s),$(".window__titlebar").each(function(){var s=$(this).closest(".window");$(this).find("a").click(function(i){i.preventDefault()}),$(this).find(".window__icon").click(function(i){$(this).siblings(".window__menutoggle").trigger("click")}),$(this).find(".window__menutoggle").click(function(i){$(s).find(".window__menu").fadeToggle(100).toggleClass("window__menu--open"),$(this).toggleClass("window__menutoggle--open")}),$(this).find(".window__close").click(function(t){$(s).addClass("window--closing"),setTimeout(function(){$(s).hide().removeClass("window--closing").addClass("window--opening")},500);var e=$(s).data("window");$('.taskbar__item[data-window="'+e+'"]').removeClass("taskbar__item--open").removeClass("taskbar__item--active");var a=$(".window").not(".window--minimized, .window--closing, .window--opening").filter(function(){return $(this).css("z-index")<i}).first();$(a).addClass("window--active")}),$(this).find(".window__minimize").click(function(i){$(s).addClass("window--minimized");var t=$(s).data("window"),e=$('.taskbar__item[data-window="'+t+'"]');$(e).removeClass("taskbar__item--active")}),$(this).find(".window__maximize").click(function(i){$(s).toggleClass("window--maximized"),$(s).hasClass("window--maximized")?(initialHeight=$(s).height(),initialWidth=$(s).width(),initialTop=$(s).position().top,initialLeft=$(s).position().left,$(s).css({height:t,width:e,top:0,left:0})):$(s).css({height:initialHeight,width:initialWidth,top:initialTop,left:initialLeft})})}),$(".window__titlebar").mouseup(function(i){var s=$(this).closest(".window");$(s).offset().top<-5&&($(s).addClass("window--maximized"),initialHeight=$(s).height(),initialWidth=$(s).width(),initialTop=$(s).position().top,initialLeft=$(s).position().left,$(s).css({height:t,width:e,top:0,left:0}))})}),$(".desktop").click(function(i){0===$(".desktop").has(i.target).length&&($(".window").removeClass("window--active"),$(".taskbar__item").removeClass("taskbar__item--active"))}),$(function(){$(".side__list ul").each(function(){$(this).find("ul").is(":visible")&&$(this).children("li").addClass("side__list--open")})}),$(function(){$(".side__list li").each(function(){$(this).children("ul").length&&$(this).children("a").append('<span class="list__toggle"></span>'),$(this).children("ul").is(":visible")&&$(this).addClass("side__list--open")})}),$(document).on("click",".list__toggle",function(){$(this).closest("li").children("ul").animate({height:"toggle",opacity:"toggle"},250),$(this).closest("li").toggleClass("side__list--open")}),$(".taskbar__item--start").click(toggleStart),$(".start-menu__recent li a").click(toggleStart),$(".start-screen__tile").click(toggleStart),$(function(){$(".taskbar__item--start").click(function(){$(this).removeClass("taskbar__item--open taskbar__item--active")})}),$(document).mouseup(function(i){var t=$(".start-menu"),e=$(".taskbar__item--start");!t.is(":visible")||e.is(i.target)||0!==e.has(i.target).length||t.is(i.target)||0!==t.has(i.target).length||toggleStart()}),$(function(){var i="",t=new Date,e=t.getHours();i=e<12?"AM":"PM",0==e&&(e=12),e>12&&(e-=12);var s=t.getMinutes();s<10&&(s="0"+s),$(".time").html(e+":"+s+" "+i)}),$(".menu-toggle").each(function(){var i=$(this).data("menu"),t=$('.menu[data-menu="'+i+'"]');$(this).position(),$(this).outerHeight();$(t).hasClass("menu--bottom")||$(t).position({my:"left top",at:"left bottom",of:this,collision:"none"}),$(t).hide(),$(this).click(function(i){i.preventDefault(),$(".menu").not(t).hide(),$(t).toggle()})}),$(document).mouseup(function(i){0!==$(".menu").has(i.target).length||$(".menu-toggle").is(i.target)||0!==$(".menu-toggle").has(i.target).length||$(".menu").hide()});