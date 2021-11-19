/*
-----------------------------------------------------------------
페이지 공통 스크립트
-----------------------------------------------------------------
*/

(function($){

	'use strict'

	var _tkObj = {}; // 공통 변수를 담을 객체

	$(function(){
		_addNewFunc().$init();
	});
	
	function _$Func(){
		_tkObj.Body =  $('body'),
		_tkObj.layout = $('#layout'),
		_tkObj.header = $('header'),
		_tkObj.dimmedBk = $('<div class="dimmedBk"></div>'),
		_tkObj.tabmenu = $('.tab-menu > li'),
		_tkObj.tabContents = $('.tab-contents'),
		_tkObj.Mtabmenu = $('.tab-menu-mob'),
		_tkObj.$title = $('#wrapper h2'),
		_tkObj.$preview = $('.preview'),
		_tkObj.hTab = $('.history').find('.h-Tab'),
		_tkObj.hCts = $('.history').find('.h-Cts'),
		_tkObj.$view = $('.view'),
		/*
		--------------------------------------------------------------
		gnb(Web)
		--------------------------------------------------------------
		*/
		_tkObj.cateList = $('.cateList'),
		_tkObj.listItem = _tkObj.cateList.find('> li'),
		_tkObj.Depth2 = _tkObj.cateList.find('.depth2'),
		_tkObj.Gnb_bg = $('.gnb-bg'),
		/*
		--------------------------------------------------------------
		gnb(mobile)
		--------------------------------------------------------------
		*/
		_tkObj.mMenu = $('.gnb-Mo'),
		_tkObj.mMenuSW = _tkObj.mMenu.find('.m_Menu_sw'),
		_tkObj.mMenuAll = $('#menuAll'),
		_tkObj.m_listItem = _tkObj.mMenuAll.find('.m_cateList > li > button'), 
		_tkObj.m_Depth2 = _tkObj.m_listItem.next('div');

		document.title = _tkObj.$title.text() + ' | 태경'; 

		var _menuOn = function(){ //cateList submenu On, Off
			_tkObj.listItem.on({
				'mouseenter focusin' : function(){
					$(this).addClass('selected');
					_tkObj.Depth2.css('display','block');
					_tkObj.Gnb_bg.css('display','block');
					setTimeout(function(){
						$('.NewPrdSlider').slick('setPosition',0);
					},0);
				},
				'mouseleave focusout' : function(){
					$(this).removeClass('selected');
				},
			});
			_tkObj.cateList.on({
				'mouseleave' : function(){
					_tkObj.listItem.removeClass('selected');
					_tkObj.Depth2.css('display','none');
					_tkObj.Gnb_bg.css('display','none');
				},
			});
		},

		_mMenuOn = function(){ //menu(Mobile) On, Off
			_tkObj.mMenuSW.on('click',function(e){
				e.preventDefault();
				e.stopPropagation();

				_tkObj.trgMo = $(this);

				var SW = _tkObj.trgMo.attr('href').substr(1),
					menuAllWid = $(window).width() - _tkObj.mMenuSW.width();

				if(SW == 'AllMenu'){
					_tkObj.mMenuAll.stop().animate({
						'left' : 0
					},{
						duration : 300,
						complete : function(){
							_tkObj.mMenu.addClass('open');
							_tkObj.layout.css({
								'height' : _tkObj.mMenuAll.height(),
								'overflow' : 'hidden'
							});
						}
					});
					_tkObj.Body.append(_tkObj.dimmedBk);
					$('.dimmedBk').addClass('visible',300,'easeOutSine');					
				}else {
					_tkObj.header.removeClass('fixed');
					_tkObj.mMenu.removeClass('open');
					_tkObj.mMenuAll.stop().animate({
						'left': '-100%' 
					},{
						duration : 300,
						complete : function(){
							_tkObj.layout.css({
								'height' : 'auto',
								'overflow' : 'visible'
							});
							_tkObj.m_listItem.removeClass('on');
							_tkObj.m_Depth2.slideUp(300);
							_tkObj.mMenuAll.stop().animate({scrollTop:0},100);
						}
					});
					$('.dimmedBk')
					.removeClass('visible',300,'easeOutSine')
					.remove();
				}
			});

			$(document).on('click','.dimmedBk',function(){
				_tkObj.header.removeClass('fixed');
				_tkObj.mMenu.removeClass('open');
				_tkObj.mMenuAll.stop().animate({
					'left': '-100%' 
				},{
					duration:300,
					complete: function(){
						_tkObj.layout.css({
							'height' : 'auto',
							'overflow' : 'visible'
						});
						_tkObj.m_listItem.removeClass('on');
						_tkObj.m_Depth2.slideUp(300);
						_tkObj.mMenuAll.stop().animate({scrollTop:0},100);
					}
				});
				$('.dimmedBk')
				.removeClass('visible',300,'easeOutSine')
				.remove();
			});

			_tkObj.m_listItem.on('click',function(e){
				e.preventDefault();
				e.stopPropagation();

				_tkObj.currentList = $(this);
				
				var mo_2depth = _tkObj.currentList.next('div');

				if(_tkObj.currentList.hasClass('on')){
					_tkObj.currentList.removeClass('on');
					mo_2depth.slideUp(300);
				}else {
					_tkObj.m_listItem.removeClass('on');
					_tkObj.currentList.addClass('on');
					mo_2depth.slideDown({
						duration:300,
						complete:function(){
							_tkObj.currentTop = _tkObj.currentList.offset().top;
							_tkObj.mMenuAll.stop().animate({scrollTop:_tkObj.currentTop},300);
						}
					});
					_tkObj.m_Depth2.not(mo_2depth).slideUp(300);
				}
			});
		},

		_PrdSlider = function(){ //gnb product slider
			_tkObj.prdSlider = $('.NewPrdSlider').slick({
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

		_tabList = function(){ // tab menu
			_tkObj.tabmenu.first().addClass('on');
			_tkObj.tabmenu.first().find('a').attr('aria-selected',true);
			_tkObj.tabContents.first().addClass('active');

			_tkObj.tabmenu.find('a').on('click',function(e){
				e.preventDefault();
				e.stopPropagation();

				var tab_trg = $(e.target),
				tab_name = tab_trg.attr('href').substr(1);

				tab_trg.closest('li').addClass('on');
				tab_trg.attr('aria-selected',true);
				_tkObj.tabmenu.find('a').not(tab_trg).closest('li').removeClass('on');
				_tkObj.tabmenu.find('a').not(tab_trg).attr('aria-selected',false);
				_tkObj.tabContents.removeClass('active');
				_tkObj.tabContents.filter('#'+tab_name).addClass('active');
				
				if(_tkObj.Mtabmenu.length){ // mobile tab menu 존재 시
					var option = _tkObj.Mtabmenu.find('option');
					option.each(function(){
						if($(this).val() == tab_name){
							$(this).prop('selected',true);
						}else{
							$(this).prop('selected',false);
						}
					});
				}
			});
		},

		_MtabList = function(){ // mobile tab menu (selectbox)
			_tkObj.Mtabmenu.find('select').on('change',function(){
				var S_Trg = $(this),
					currentVal = S_Trg.find('option:selected').val();

				_tkObj.tabContents.removeClass('active');
				_tkObj.tabContents.filter('#'+currentVal).addClass('active');

				_tkObj.tabmenu.each(function(){
					var currentTab = $(this).find('a').attr('href').substr(1);
					
					if(currentTab == currentVal){
						$(this)
						.addClass('on')
						.find('a').attr('aria-selected',true);
					}else{
						$(this)
						.removeClass('on')
						.find('a').attr('aria-selected',false);
					}
				})
			});
		},

		_historyTab = function(){
			_tkObj.hTab.first().closest('li').addClass('selected');
			_tkObj.hCts.first().css('display','block');

			_tkObj.hTab.find('a').on('click',function(e){
				e.preventDefault();
				e.stopPropagation();

				var hTrg = $(this),
					hName = hTrg.attr('href').substr(1),
					hCts =  $('.history .h-Cts#'+hName);

					if(hTrg.closest('li').hasClass('selected')){
						hTrg.closest('li').removeClass('selected');
						hCts.stop().slideUp(300);
					}else{
						hTrg.closest('li').addClass('selected');
						hCts.stop().slideDown(300,function(){
							hCts.find('dl').removeClass('motion');
							$('body, html').stop().animate({
								scrollTop : hTrg.closest('.h-Tab').offset().top - _tkObj.header.height()	
							},400);
						});
					}
			});
		},

		_setScrTop = function(){
			function _setScrTop(tabID) { // move section
				var sectionTop = $('#'+tabID).offset();

				$('body,html').stop(true,false).delay(300).animate({
					scrollTop : sectionTop.top
				},600,function(){
					//_tkObj.allowEvent = true;
					_tkObj.layout.off('touchmove');
				});
			}

			return _setScrTop;
		}(),

		_motionStart = function(){
			_tkObj.$preview.each(function(){
				$(this).find('.animated').removeClass('ani-stop');
			});
		},

		_optionChange = function(){
			$('.urlChange').each(function(){
				$(this).find('select').on('change',function(e){
					var val = $(e.target).find('option:selected').val();

					location.href = val;
				});
			});
		},

		_policyChange = function(){
			_tkObj.$pHead = $('.container.voc .contents .p_head');
			_tkObj.$pBody = _tkObj.$pHead.next('.p_body');

			$('#btn_Pchg').on('click', function(){
				var crtValue = $('#currentPolicy select').find('option:selected').val();
				$.get('policy_history.html', function(data){
					_tkObj.$pBody.html($(data).filter('#' + crtValue).html());
				});
			});
		},

		_anchorList = function(){
			$(document).on('click', '.anchor-list a' ,function(e){
				e.preventDefault();
				e.stopPropagation();

				var anchor = $(this).attr('href'),
				anchorPos = $(anchor).offset().top - 90;

				$('body, html').stop().animate({'scrollTop' : anchorPos + 'px'},300);
			});
		},

		_showFaqReply = function(){ // FAQ 
			var Reply = $('.faq-list .btnFaqReply'),
			etclink = $('.faq-list dl dt > span');

			etclink.attr('tabindex',0);

			Reply.on('click',function(e){
				e.preventDefault();
				e.stopPropagation();

				var trg_r = $(this),
				qT = Reply.closest('dl'),
				$qT = trg_r.closest('dl');

				if($qT.hasClass('selected')){
					$qT.removeClass('selected').find('dd').stop().slideUp(300);
				}else{
					$qT.addClass('selected').find('dd').stop().slideDown(300);
					qT.not($qT).removeClass('selected').find('dd').stop().slideUp(300);
				}
			});

			etclink.on('click',function(){
				var trg_etc = $(this),
				_qT = etclink.closest('dl'),
				_$qT = trg_etc.closest('dl');

				if(_$qT.hasClass('selected')){
					_$qT.removeClass('selected').find('dd').stop().slideUp(300);
				}else{
					_$qT.addClass('selected').find('dd').stop().slideDown(300);
					_qT.not(_$qT).removeClass('selected').find('dd').stop().slideUp(300);
				}
			});
		},

		_hoverEffect = function(){
			var recruit_list = $('.recruit-list > ul > li'),
				Brand_list = $('.brand-list .prd-list ul li'),
				business_list = $('.bs-list ul li');

			recruit_list.find('> a').each(function(){
				$(this).on({
					'mouseenter focusin' : function(){
						$(this).closest('li').addClass('on');
					},
					'mouseleave focusout' : function(){
						$(this).closest('li').removeClass('on');
					}
				});
			});

			Brand_list.attr('tabindex',0);

			Brand_list.each(function(){
				var crt_BrandItem = $(this);

				crt_BrandItem.on({
					'mouseenter focusin' : function(){
						crt_BrandItem.find('> .prd_detail').stop().fadeIn(300);
					},
					'mouseleave focusout' : function(){
						crt_BrandItem.find('> .prd_detail').stop().fadeOut(300);
					}
				});
			});

			business_list.each(function(){
				var crt_businessItem = $(this);

				crt_businessItem.on({	
					'mouseenter focusin' : function(){
						crt_businessItem.find('.hWrap').stop().fadeIn(300);
					},
					'mouseleave focusout' : function(){
						crt_businessItem.find('.hWrap').stop().fadeOut(300);
					}
				});
			});
		},

		_blockContextMenu = function(){ //우 클릭, 드래그 방지
			$(document).on('contextmenu selectstart dragstart',function(){
				return false;
			});
		},

		$init = function(){
			_menuOn();
			_mMenuOn();
			_PrdSlider();
			_tabList();
			_MtabList();
			_motionStart();
			_optionChange();
			_historyTab();
			_showFaqReply();
			_hoverEffect();
			_policyChange();
			_anchorList();
			//_blockContextMenu();
		}

		return {
			$init : $init,
			_setScrTop : _setScrTop
		}

	}

	window.onload = function(){
		$(this).on('scroll',function(){
			if(!_tkObj.mMenu.hasClass('open')){
				if($(window).scrollTop() > _tkObj.header.height()){
					if(!_tkObj.header.hasClass('fixed')){
						_tkObj.header.addClass('fixed');
						gsap.set(_tkObj.header,{top:0});
						gsap.from(_tkObj.header,0.2,{
							top:'-100px'
						});
					}
				}else {
					_tkObj.header.removeClass('fixed');
				}
			}
			
			_tkObj.$view.each(function(){
				var currentTarget = $(this),
				currentTargetPos = currentTarget.offset().top - (_tkObj.header.height() * 8);

				if($(window).scrollTop() >= currentTargetPos){
					currentTarget
					.find('.animated')
					.removeClass('ani-stop');
				}
			});

			_tkObj.hCts.each(function(){
				var _hCts = $(this),
				_hCts_box = _hCts.find('> div');

				if(_hCts.closest('li').hasClass('selected')){
					for(var d = 0; d < _hCts_box.length; d++){
						(function(n){
							var $Top = _hCts_box.eq(d).offset().top;

							if($(window).scrollTop() >= $Top - (_tkObj.header.height() * 7)){
								_hCts_box.eq(d).find('dl').addClass('motion');
								var motionTrg = _hCts_box.eq(d).find('span');
								gsap.to(motionTrg,0.45,{x:0,opacity:1,delay:0.2});
							}
						})(d);
					}
				}
			});
		});
	};

	function _addNewFunc(){
		var _addNewFunc = new _$Func();

		return _addNewFunc;
	}
})(jQuery);