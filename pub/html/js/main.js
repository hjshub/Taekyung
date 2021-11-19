/*
-----------------------------------------------------------------
메인 스크립트
-----------------------------------------------------------------
*/

(function($){

	'use strict'

	var tkObj = {}; // 메인 공통 변수를 담을 객체

	$(function(){
		addNewFunc().bgChange();
		addNewFunc().$init();
		addNewFunc().mouseWheelEV();

		if(getCookie('lpop01') != 'done'){ // 레이어 팝업 - 01
			addNewFunc().OpenLayerPop('lpop01');
		}
		if(getCookie('lpop02') != 'done'){ // 레이어 팝업 - 02
			addNewFunc().OpenLayerPop('lpop02');
		}
	});
	
	function $Func(){
		tkObj.Body =  $('body'),
		tkObj.layout = $('#layout'),
		tkObj.header = $('header'),
		tkObj.section = $('.section'),
		tkObj.$leng = tkObj.section.length,
		tkObj.trgScr = $('.moveScroll'),
		tkObj.tabmenu = $('.tab-menu'),
		tkObj.dimmedBk = $('<div class="dimmedBk"></div>'),
		tkObj.dimmedBk2 = $('<div class="dimmedBk2"></div>'),
		tkObj.$title = $('#wrapper h1'),
		tkObj.mainSlider = $('.MainSlider'),
		tkObj.mainItem = tkObj.mainSlider.find('.mainItem'),
		tkObj.brandSlider = $('.brand_prd'),
		tkObj.lpop = $('.lpopArea .lpop'),
		tkObj.$scrollPos = 0, // 스크롤 초기 값 0
		tkObj.allowEvent = true,
		tkObj.isMobile,
		tkObj.agent = navigator.userAgent, // browser version check
		/*
		--------------------------------------------------------------
		gnb(Web)
		--------------------------------------------------------------
		*/
		tkObj.cateList = $('.cateList'),
		tkObj.listItem = tkObj.cateList.find('> li'),
		tkObj.Depth2 = tkObj.cateList.find('.depth2'),
		tkObj.Gnb_bg = $('.gnb-bg'),
		/*
		--------------------------------------------------------------
		gnb(mobile)
		--------------------------------------------------------------
		*/
		tkObj.mMenu = $('.gnb-Mo'),
		tkObj.mMenuSW = tkObj.mMenu.find('.m_Menu_sw'),
		tkObj.mMenuAll = $('#menuAll'),
		tkObj.m_listItem = tkObj.mMenuAll.find('.m_cateList > li > button'), 
		tkObj.m_Depth2 = tkObj.m_listItem.next('div');

		document.title = tkObj.$title.text() + ' | 태경'; 

		var mouseWheelEV = function(){ // mousewheel Event
			tkObj.isMobile = $(window).width() > 1024 ? false : true;

			if(!tkObj.isMobile){
				tkObj.layout.on('mousewheel',function(event, delta){
					event.preventDefault();
					event.stopPropagation();
					
					if(tkObj.allowEvent){
						if (delta > 0 && tkObj.$scrollPos != 0){ 
							tkObj.$scrollPos--;
						}else if (delta < 0 && tkObj.$scrollPos < tkObj.$leng-1){
							tkObj.$scrollPos++;
						}
						tkObj.allowEvent = false;
						tkObj.scroll = parseInt(tkObj.$scrollPos) + 1;
						setScrTop('section0'+ tkObj.scroll);
					}
				});
			}else{
				tkObj.layout.off('mousewheel');
			}
		},

		scrollify = function(){ // move scroll
			tkObj.section.removeClass('active');
			tkObj.section.eq(0).addClass('active');
			tkObj.trgScr.eq(0).addClass('active');

			tkObj.trgScr.each(function(){
				var $trgscr = $(this),
				PosScr = $trgscr.attr('href').substr(1),
				scrval = PosScr.split('0')[1];
				
				$trgscr.on('click',function(e){
					e.preventDefault();
					e.stopPropagation();

					tkObj.$scrollPos = scrval-1;
					
					setScrTop(PosScr);
				});
			});
		},

		menuOn = function(){ //menu(Web) On, Off
			tkObj.listItem.on({
				'mouseenter focusin' : function(){
					$(this).addClass('selected');
					tkObj.Depth2.css('display','block');
					tkObj.Gnb_bg.css('display','block');
					setTimeout(function(){
						$('.NewPrdSlider').slick('setPosition',0);
					},0);
				},
				'mouseleave focusout' : function(){
					$(this).removeClass('selected');
				},
			});
			tkObj.cateList.on({
				'mouseleave' : function(){
					tkObj.listItem.removeClass('selected');
					tkObj.Depth2.css('display','none');
					tkObj.Gnb_bg.css('display','none');
				},
			});
		},

		mMenuOn = function(){ //menu(Mobile) On, Off
			tkObj.mMenuSW.on('click',function(e){
				e.preventDefault();
				e.stopPropagation();

				tkObj.trgMo = $(this);

				var SW = tkObj.trgMo.attr('href').substr(1),
					menuAllWid = $(window).width() - tkObj.mMenuSW.width();

				if(SW == 'AllMenu'){
					tkObj.mMenuAll.stop().animate({
						'left' : 0
					},{
						duration : 300,
						complete : function(){
							tkObj.mMenu.addClass('open');
							tkObj.layout.css({
								'height' : tkObj.mMenuAll.height(),
								'overflow' : 'hidden'
							});
						}
					});
					tkObj.Body.append(tkObj.dimmedBk);
					$('.dimmedBk').addClass('visible',300,'easeOutSine');					
				}else {
					tkObj.$scrollPos = 0;
					tkObj.header.removeClass('fixed');
					tkObj.mMenu.removeClass('open');
					tkObj.mMenuAll.stop().animate({
						'left': '-100%' 
					},{
						duration : 300,
						complete : function(){
							tkObj.layout.css({
								'height' : 'auto',
								'overflow' : 'visible'
							});
							tkObj.m_listItem.removeClass('on');
							tkObj.m_Depth2.slideUp(300);
							tkObj.mMenuAll.stop().animate({scrollTop:0},100);
						}
					});
					$('.dimmedBk')
					.removeClass('visible',300,'easeOutSine')
					.remove();
				}
			});

			$(document).on('click','.dimmedBk',function(){
				tkObj.$scrollPos = 0;
				tkObj.header.removeClass('fixed');
				tkObj.mMenu.removeClass('open');
				tkObj.mMenuAll.stop().animate({
					'left': '-100%' 
				},{
					duration:300,
					complete: function(){
						tkObj.layout.css({
							'height' : 'auto',
							'overflow' : 'visible'
						});
						tkObj.m_listItem.removeClass('on');
						tkObj.m_Depth2.slideUp(300);
						tkObj.mMenuAll.stop().animate({scrollTop:0},100);
					}
				});
				$('.dimmedBk')
				.removeClass('visible',300,'easeOutSine')
				.remove();
			});

			tkObj.m_listItem.on('click',function(e){
				e.preventDefault();
				e.stopPropagation();

				tkObj.currentList = $(this);
				
				var mo_2depth = tkObj.currentList.next('div');

				if(tkObj.currentList.hasClass('on')){
					tkObj.currentList.removeClass('on');
					mo_2depth.slideUp(300);
				}else {
					tkObj.m_listItem.removeClass('on');
					tkObj.currentList.addClass('on');
					mo_2depth.slideDown({
						duration:300,
						complete:function(){
							tkObj.currentTop = tkObj.currentList.offset().top;
							tkObj.mMenuAll.stop().animate({scrollTop:tkObj.currentTop},300);
						}
					});
					tkObj.m_Depth2.not(mo_2depth).slideUp(300);
				}
			});
		},

		bgChange = function(){ // 메인배너 background change
			tkObj.bnrWeb = $(window).width() > 768 ? true : false;

			tkObj.mainItem.each(function(){
				var dataUrl = $(this).attr('data-url'),
					dataMobUrl = $(this).attr('data-mob-url');

				if(tkObj.bnrWeb) { // Web
					$(this).css({
						'background-image' : 'url('+ dataUrl +')',
						'background-position' : 'center 0',
						'background-repeat' : 'no-repeat'
					});
				}else { // mobile
					$(this).css({
						'background-image' : 'url('+ dataMobUrl +')',
						'background-position' : 'center 0',
						'background-repeat' : 'no-repeat'
					});
				}
			});
		},
		
		MainSlider = function(){ //main slider
			tkObj.$mainSlider = tkObj.mainSlider.slick({
				arrows:true,
				prevArrow:'<span class="arrow-prev"><button><em class="hidden_txt">Previous(이전)</em></button></span>',
				nextArrow:'<span class="arrow-next"><button><em class="hidden_txt">Next(다음)</em></button></span>',
				dots: true,
				infinite: true,
				speed: 600,
				slidesToShow: 1,
				slidesToScroll: 1,
				autoplay: true,
					autoplaySpeed: 4000,
					pauseOnHover:false,
					pauseOnFocus:false,
				accessibility:true,
				touchMove:true,
				adaptiveHeight:true
			});
			setTimeout(function(){
				tkObj.mainSlider.fadeIn(300);
				tkObj.mainSlider.slick('setPosition',0);
			},100);

			tkObj.mainSlider
			.find('.slick-slide.slick-active')
			.find('[class*=ani-start]')
			.removeClass('ani-stop');

			tkObj.mainSlider.on({
				'afterChange' : function(event, slick, currentSlide, nextSlide){
				 var slickSlide = $(this).find('.slick-slide'),
				 	 activeSlickSlide = $(this).find('.slick-active');

				 slickSlide.not(activeSlickSlide).find('[class*=ani-start]').addClass('ani-stop');
				 activeSlickSlide.find('[class*=ani-start]').removeClass('ani-stop');
				}
			});
			
			tkObj.mainSlider.find('.slick-arrow button').on({
				'mouseenter focusin' : function(){
					$(this).closest('.slick-arrow').addClass('over');
				},

				'mouseleave focusout' : function(){
					$(this).closest('.slick-arrow').removeClass('over');
				}
			});
		},

		PrdSlider = function(){ //gnb product slider
			tkObj.prdSlider = $('.NewPrdSlider').slick({
				arrows:false,
				dots: true,
				infinite: true,
				speed: 600,
				slidesToShow: 1,
				slidesToScroll: 1,
				autoplay:false,
				accessibility:true,
				touchMove:true,
				adaptiveHeight:false
			});	
		},

		BrandSlider = function(){
			tkObj.bsSwiperList = [];

			for(var i=0; i < tkObj.brandSlider.length; i++){
				var SwiperList = new Swiper(tkObj.brandSlider.eq(i).find('.swiper-container'),{
					scrollbar: {
			        	el: '.swiper-scrollbar',
			        	draggable:true,
			        	hide: false,
			        	dragSize: 'auto',
			        	snapOnRelease: false
				    },
				    pagination: {
						el: '.swiper-pagination',
						clickable: true,
					},
					width:1160,
					setWrapperSize: true,
					autoplay: false,
					slidesPerView: 4,
					slidesPerGroup: 1,
					loop: false,
					watchOverflow: true,
					spaceBetween: 0,
					debugger: true, // Enable debugger
					breakpoints : {
					    1480 : {
					    	width : 870,
					      	slidesPerView: 3
					    },
					    1024 : {
					    	width : 580,
					      	slidesPerView: 2
					    },
					    376 : {
					    	width : 360,
					      	slidesPerView: 1
					    },
					}
				});

				tkObj.bsSwiperList.push(SwiperList);

				(function(n){
					setTimeout(function(){
						tkObj.bsSwiperList[n].scrollbar.updateSize();
					},500);
				})(i);
			}
		},

		NewsSlider = function(){ // news slider
			tkObj.newsSlider = $('.NewsSlider .swiper-container'),
			tkObj.slideLength = tkObj.newsSlider.find('.swiper-slide').length; // 슬라이더 총 개수

			var Swiper01 = new Swiper(tkObj.newsSlider, {
			  	on : {
				  	transitionStart: function(){
				  		startSlide();

				  		tkObj.newsSlider
				  		.find('.preview')
				  		.stop().fadeOut();
				  	},
				  	transitionEnd: function(){
			  			tkObj.newsSlider
			  			.find('.preview')
			  			.html('<img src="'+ preview() +'" alt="다음 이미지 미리보기"/>')
			  			.stop().fadeIn('200');
				  	}
			  	},
				pagination: {
					el: '.swiper-pagination',
					clickable: true,
				},
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
				},
		      	loop:true,
		      	slidesPerView: 1,
				slidesPerGroup: 1,
		      	debugger: true // Enable debugger
		    });

		    function startSlide(){
		    	var s_active = tkObj.newsSlider.find('.swiper-slide-active'),
		    	a_idx = s_active.data('swiper-slide-index');
			  		
		  		$('.s_txt').removeClass('active');
		  		$('.s_txt[data-idx='+a_idx+']').addClass('active');
		    }

		    function preview(){
		    	var s_active = tkObj.newsSlider.find('.swiper-slide-active'),
		    	a_idx = s_active.data('swiper-slide-index'),
		    	n_idx;

		    	a_idx == tkObj.slideLength - 1 ? n_idx = 0 : n_idx = a_idx + 1;

		    	var $s_next = tkObj.newsSlider.find('.swiper-slide[data-swiper-slide-index='+n_idx+']'),
		    	preview_thumNail = $s_next.find('img').attr('src');

		    	return preview_thumNail;
		    }
		},

		browserCheck = function(){
			if(tkObj.agent.toLowerCase().indexOf('msie 9') != -1){ // ie 9 {
				//console.log('ie 9');
			}else { //  ie 10 이상 or etc browser 
				//console.log('etc browser');
				NewsSlider();
				BrandSlider();
			}
		},


		SnsSlider = function(){ //sns slider
			tkObj.snsSlider = $('#section06 .sns-list').slick({
				arrows:false,
				dots: true,
				infinite: true,
				speed: 600,
				slidesToShow: 3,
				slidesToScroll: 1,
				autoplay:false,
				accessibility:true,
				touchMove:true,
				adaptiveHeight:false,
				responsive: [
				    {
				      breakpoint: 1025,
				      settings: {
				        slidesToShow: 2
				      }
				    },
				    {
				      breakpoint: 641,
				      settings: {
				        slidesToShow: 1
				      }
				    }	
			    ]
			});
		},

		setScrTop = function(){
			function $setScrTop(tabID) { // move section
				var sectionTop = $('#'+tabID).offset();

				$('body,html').stop(true,false).delay(300).animate({
					scrollTop : sectionTop.top
				},600,function(){
					tkObj.allowEvent = true;
					tkObj.layout.off('touchmove');
				});
			}

			return $setScrTop;
		}(),
		
		tabList = function(){ // tab menu
			tkObj.tabmenu.each(function(){
				var currentTabMenu = $(this),
				currentTablist = currentTabMenu.find('li');

				currentTablist.first().addClass('on');
				currentTablist.first().find('a').attr('aria-selected',true);

				var currentTabCts = currentTabMenu.siblings('.tab-contents');

				currentTabCts.first().addClass('active');

				currentTablist.find('a').on('click',function(e){
					e.preventDefault();
					e.stopPropagation();

					var tab_trg = $(e.target),
					tab_name = tab_trg.attr('href'),
					trgIdx = currentTabMenu.find('a').index(tab_trg);

					tab_trg.closest('li').addClass('on');
					tab_trg.attr('aria-selected',true);
					currentTabMenu.find('a').not(tab_trg).closest('li').removeClass('on');
					currentTabMenu.find('a').not(tab_trg).attr('aria-selected',false);
					currentTabCts.removeClass('active');
					currentTabCts.filter(tab_name).addClass('active');

					if(currentTabMenu.hasClass('brand-list')){ // 탭 메뉴가 브랜드 리스트에 해당 될 경우
						$('#section03 .cts-header dd').css('display','none');
						$('#section03 .cts-header dd').eq(trgIdx).css('display','block');

						currentTabCts.filter(tab_name)
						.find('.brand_prd .swiper-pagination span')
						.first().trigger('click');

						for(var t=0; t < tkObj.bsSwiperList.length; t++){ // 브랜드 슬라이드 스크롤 리셋
							tkObj.bsSwiperList[t].scrollbar.updateSize();
						}
					}
					
				});
			});
		},

		optionChange = function(){
			$('.urlChange').each(function(){
				$(this).find('select').on('change',function(e){
					var val = $(e.target).find('option:selected').val();

					location.href = val;
				});
			});
		},

		hoverFunc = function(){
			tkObj.brandInfo = $('#section05 .brand-info'),
			tkObj.brandLogo = $('.brand-list-item .brand_logo');

			tkObj.brandInfo.find('.view').attr('tabindex',0);
			tkObj.brandLogo.attr('tabindex',0);
			tkObj.brandSlider.find('li').attr('tabindex',0);

			tkObj.brandInfo.find('.view').on({
				'mouseenter focusin' : function(){
					$(this).closest(tkObj.brandInfo).addClass('over');
				}
			});
			
			tkObj.brandInfo.on({
				'mouseleave focusout' : function(){
					$(this).removeClass('over');
				}
			});

			tkObj.brandLogo.on({
				'mouseenter focusin' : function(){
					$(this).find('.over').stop().fadeIn('300');
				},
				'mouseleave focusout' : function(){
					$(this).find('.over').stop().fadeOut('300');
				}
			});

			tkObj.brandSlider.find('li').on({
				'mouseenter focusin' : function(){
					$(this).find('.prd_detail').stop().fadeIn('300');
				},
				'mouseleave focusout' : function(){
					$(this).find('.prd_detail').stop().fadeOut('300');
				}
			});
		},

		OpenLayerPop = function(){ // 레이어 팝업
			function OpenLayerPop(ID){
				var Current_lpop = tkObj.lpop.filter('#' + ID),
				btnlpopClose = Current_lpop.find('.btn_lpopClose');

				if(Current_lpop.length > 0){
					Current_lpop.css('display','block');
				}

				btnlpopClose.on('click',function(){
					var checkPop = Current_lpop.find('.checkForm input[type=checkbox]');

					if(checkPop.prop('checked') == true){
						setCookie(ID,'done',1);
					}

					Current_lpop.css('display','none');
				});
			}

			return OpenLayerPop;
		}(),

		blockContextMenu = function(){ //우 클릭, 드래그 방지
			$(document).on('contextmenu selectstart dragstart',function(){
				return false;
			});
		},

		$init = function(){
			MainSlider();
			browserCheck();
			PrdSlider();
			SnsSlider();
			scrollify();
			menuOn();
			mMenuOn();
			hoverFunc();
			tabList();
			optionChange();
			blockContextMenu();
		}

		return {
			$init : $init,
			mouseWheelEV : mouseWheelEV,
			bgChange : bgChange,
			setScrTop : setScrTop,
			OpenLayerPop : OpenLayerPop
		}

	}

	function addNewFunc(){
		var addNewFunc = new $Func();

		return addNewFunc 
	}

	window.onload = function(){
		addNewFunc().setScrTop('section01');

		$(this).on("scroll", function() {
			if(!tkObj.isMobile){
				if(tkObj.$scrollPos >= 1){
					if(!tkObj.header.hasClass('fixed')){
						tkObj.header.addClass('fixed');
						gsap.set(tkObj.header,{top:0});
						gsap.from(tkObj.header,0.4,{
							top:'-100px'
						});
					}
				}else {
					tkObj.header.removeClass('fixed');
				}

				if(tkObj.$scrollPos >= 1 && tkObj.$scrollPos < 4){ // section 2,3,4
					$('.pageNavigation').css('color','#000');
				}else {
					$('.pageNavigation').css('color','#fff');
				}
				
				if(tkObj.$scrollPos != tkObj.$leng - 1){
					$('.pageNavigation').find('.moveScroll').removeClass('active');
					$('.pageNavigation').find('.moveScroll').eq(tkObj.$scrollPos).addClass('active');
				}

				tkObj.section.eq(0).find('> .wrap').css('visibility','visible');
			}else {
				if(!tkObj.mMenu.hasClass('open')){
					if($(window).scrollTop() > tkObj.header.height()){
						if(!tkObj.header.hasClass('fixed')){
							gsap.set(tkObj.header,{top:0});
							gsap.from(tkObj.header,0.2,{
								top:'-100px',
								onComplete : function(){
									tkObj.header.addClass('fixed');
								}
							});
						}
					}else {
						tkObj.header.removeClass('fixed');
					}
				}

				if($(window).scrollTop() > document.documentElement.scrollHeight / 2){
					tkObj.section.eq(0).find('> .wrap').css('visibility','hidden');
				}else {
					tkObj.section.eq(0).find('> .wrap').css('visibility','visible');
				}
			}
		});
		$(this).on("resize", function() {
			addNewFunc().bgChange();
			addNewFunc().mouseWheelEV();
		});
	};
})(jQuery);

// 쿠키설정
function setCookie(cName, cValue, cDay){
	var expire = new Date();

	expire.setDate(expire.getDate() + cDay);
	cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐을 막기위해 escape(cValue)를 합니다.
	if(typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
    	document.cookie = cookies;
}
 
function getCookie(cName) {
    cName = cName + '=';
    var cookieData = document.cookie;
    var start = cookieData.indexOf(cName);
    var cValue = '';
    if(start != -1){
        start += cName.length;
        var end = cookieData.indexOf(';', start);
        if(end == -1)end = cookieData.length;
        cValue = cookieData.substring(start, end);
    }
    return unescape(cValue);
}