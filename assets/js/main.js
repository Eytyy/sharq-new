var SHARQ = (function () {
	//---------------- BEGIN MODULE SCOPE VARIABLES --------------
	var jqueryMap = {
			$dropdown_link             : $('.nav__control__item__w__dropdown > a'),
			$notifications             : $('.notification__message').find('a'),
			$search_toggle			   : $('#toggleSearch'),
			$notifications_close_link  : $('#closeMessages'),
			$createEvent_btn           : $('#eventCreate'),
			$contact_btn               : $('.contact-trig'),
			$user_settings_btn         : $('#toggleUserSettings'),
			$admin_dd_btn              : $('.admin__link_d'),
			$admin_conf_ws_cb          : $('#hasWorkshop'),
			$admin_conf_p_cb           : $('#hasPanel'),
			$album_el 				   : $('.album-el-link'),
			$album_el_desc_btn         : $('#toggleModalDescription'),
			$modal_window              : $('.modal'),
			$close_modal_btn           : $('.closeModal'),
			$mobile_menu_trig          : $('#triggerMobileMenu')
		},
		stateMap = {
			'mobileLinksList' : false
		},
		onSearchToggle,
		MESSAGES,
		adjustSharqPostNav,
		openDropDown, closeDropDown,
		openModal, closeModal,
		setupDropMenu, listToDropdown, toggleDropMenu, onClickDropListLink, onClickAnchor,
		onMobileMenu,
		showUserSettings,
		onClickAlbumItem,
		onCloseModal,
		showEventCustomNotification;
	//----------------- END MODULE SCOPE VARIABLES ---------------

	MESSAGES = (function () {
		var openMessageModal = function (e) {
				openModal();
		 		e.preventDefault();
		 		closeDropDown();
			},
			closeMessageModal = function (e) {
				closeModal();
				$('#messages-modal').removeClass('is-open');
		 		e.preventDefault();
			};

		return {
			openMessages : openMessageModal,
			closeMessags : closeMessageModal
		}
	})();

	//--------------------- BEGIN DOM METHODS --------------------
	// Fix the positioning of the inner post navigation while scrolling
	adjustSharqPostNav = function () {
		var contentOffset  = $('.sharq-post__content__main').offset().top,
			postNav = $('.post__nav'),
			scrollLimit;
		
		// $.throttle to minimize the event calls on scroll
		$(window).on('scroll', $.throttle(250, function () {
			// If window width greater than 1180px it means we have to cols layout
			// Meaning that we will have the comments component below the content.
			if ( $(window).width() > 1180 ) {
				scrollLimit = (Math.floor($('.comments').offset().top) - 200) - contentOffset - postNav.height() - 40;
				$(window).scrollTop() > scrollLimit ? $('.post__nav').addClass('setAtBottom') : $('.post__nav').removeClass('setAtBottom');
			}
			// IF window width greater than 920 and less thant 1180px it means that we have a single
			// col layout, Meaning we will have the side bar below the content.
			else if ($(window).width() > 920 && $(window).width() < 1180) {
				scrollLimit = (Math.floor($('.sidebar__col').offset().top) - 200) - contentOffset - postNav.height() - 40;
				$(window).scrollTop() > scrollLimit ? $('.post__nav').addClass('setAtBottom') : $('.post__nav').removeClass('setAtBottom');
			} 
			// Default Single col but the navigation will be a dropdown list at this stage
			// Sticking on top instead of a list floating on the left.
			else {
				if ( $(window).scrollTop() > contentOffset ) {
					$('.post__nav').addClass('setAtTop');
				} else {
					$('.post__nav').removeClass('setAtTop');
				}
			}
		}));
	};

	openDropDown = function (event) {
		$(this).parent().toggleClass('active').siblings().removeClass('active');
		event.preventDefault();
	};
	closeDropDown = function () {
		$('.nav__control__item__w__dropdown').removeClass('active');
	};

	openModal = function () {
		jqueryMap.$modal_window.addClass('is-open');
		$('body').addClass('isModalActive');
	};

	closeModal = function () {
		jqueryMap.$modal_window.removeClass('is-open');
		$('body').removeClass('isModalActive');
	};

	showEventCustomNotification = function (e) {
		$("html, body").animate({ scrollTop: 0 }, 'fast', function() {
			$('#event-notification-msg').addClass('is-visible');
			$('#admin__event-create').addClass('is-hidden');
		});
		e.preventDefault();
	};

	setupDropMenu = function ($list) {
		var w           = $(window).width(),
			list        = $list,
			list_links	= $list.find('a'),
			activeChild = list.find('.active'),
			anchor,
			anchorValue;

		if ( !stateMap.mobileLinksList ) {
			anchor = $('<span class="dropdown-toggle" data-toggle="dropdown">'
						+ '<span class="valueOfButton"></span>'
                        + '<i class="fa fa-caret-down"></i></span>');

			anchorValue = anchor.find('.valueOfButton');
			activeChild.length === 0 ? anchorValue.html("Go To")  : anchorValue.html(activeChild.html());
			list.addClass('custom_menuList');
			list.prepend(anchor);
			anchor.on('click', onClickAnchor);
			list_links.on('click', onClickDropListLink);
		}
	};

	listToDropdown = (function () {
		$(function(){
			if ($('.sub_nav').length > 0) {
				setupDropMenu( $('.sub_nav') );
			}	else if ($('.post__nav')) {
				setupDropMenu( $('.post__nav') );
			} 
			else {
				return false;
			}
			stateMap.mobileLinksList = true;
		});
	})();

	toggleDropMenu = function () {
		$('.custom_menuList').find('ul').toggleClass('active');
	};


	//--------------------- END DOM METHODS ----------------------


	//------------------- BEGIN EVENT HANDLERS -------------------


	onClickDropListLink = function (e) {
		var anchor = $('.custom_menuList').find('.dropdown-toggle');
		if ( $(window).width() < 1180 ) {
			anchor.find('.valueOfButton').html($(this).text());
			toggleDropMenu();
			e.preventDefault();
		}
	};

	onClickAnchor = function (e) {
		toggleDropMenu();
	};

	onSearchToggle = function (e) {
		$('#header-search').toggleClass('isActive');
		e.preventDefault();
	};

	/* This method overrides the openDropDown default behaviour
	 * and attaches new events on links for mobile menu
	 */
	onMobileMenu = function () {
		$('body').toggleClass('is-menuActive');
	};

	showContactInfo = function (e) {
		$(this).parent().siblings().removeClass('contact-visible');
		$(this).parent().toggleClass('contact-visible');
		e.preventDefault();
	};

	showUserSettings = function (event) {
		$(this).parent().toggleClass('active');
		event.preventDefault();
	},

	onClickAlbumItem = function () {
		openModal();
	};

	onCloseModal = function() {
		closeModal();
	};

	onToggleAlbumElementDescription = function () {
		$(this).parent().toggleClass('is-galleryDescriptionVisible');
	};
	//-------------------- END EVENT HANDLERS --------------------


	//------------------- BEGIN PUBLIC METHODS -------------------
	initModule = (function () {
		// Init Events

		$('.dropdown-trig').on('click', function () {
			$(this).parent().siblings().find('.dropdown').removeClass('isVisible');
			$(this).next('.dropdown').toggleClass('isVisible');
		});

		jqueryMap.$dropdown_link.on('click', openDropDown);

		jqueryMap.$admin_dd_btn.on('click', openDropDown);

		jqueryMap.$mobile_menu_trig.on('click', onMobileMenu);

		jqueryMap.$search_toggle.on('click', onSearchToggle);

		jqueryMap.$contact_btn.on('click', showContactInfo);

		jqueryMap.$user_settings_btn.on('click', showUserSettings);

		jqueryMap.$notifications.on('click', MESSAGES.openMessages );
		
		jqueryMap.$notifications_close_link.on('click', MESSAGES.closeMessags );

		jqueryMap.$createEvent_btn.on('click', showEventCustomNotification);

		jqueryMap.$album_el.on('click', onClickAlbumItem);

		jqueryMap.$album_el_desc_btn.on('click', onToggleAlbumElementDescription);

		jqueryMap.$close_modal_btn.on('click', onCloseModal);

		jqueryMap.$admin_conf_ws_cb.on('change', function () {
			if (this.checked) {
				$('#conference-workshop').show();
			} else {
				$('#conference-workshop').hide();
			}
		});

		jqueryMap.$admin_conf_p_cb.on('change', function () {
			if (this.checked) {
				$('#conference-panel').show();
			} else {
				$('#conference-panel').hide();
			}
		});

		jqueryMap.$admin_conf_ws_cb.prop('checked') ? $('#conference-workshop').show() : $('#conference-workshop').hide();
		jqueryMap.$admin_conf_p_cb.prop('checked') ? $('#conference-panel').show() : $('#conference-panel').hide();


		// Fixed Elements Behavior
		if ($('.post__event').length) {
			adjustEventNavigationPosition();
		}
		if ($('.sharq-post').length) {
			adjustSharqPostNav();
		}

		// Init Plugins Scripts

		// FitVids.js -- Responsive Videos plugin.
		if ( $('.inline_embed.video').length ) {
			$('.inline_embed.video').fitVids();
		}

		// cycle2.js -- slideshow plugin
		if ( $('#slider').length ) {
			$('#slider').cycle({
				log 			: false,
				fx              : "fade",
				speed 	        : 700,
				timeout         : 0,
				next 			: "#nextSlide",
				prev 			: "#prevSlide",
				slides          : $('.slide'),
			});
		}
			
		// fullCalendar.js -- Calendar plugin
		if ( $('#calendar').length ) {
			$('#calendar').fullCalendar({
				header: {
					left: 'prev,next today',
					center: 'title',
					right: 'month,agendaWeek,agendaDay'
				},
				defaultDate: '22 Oct 2014',
				editable: false,
				eventLimit: true, // allow "more" link when too many events
				events: [
					{"title":"ملتقى الثقافة ","start":"16 Oct 2014","end":"19 Oct 2014"},
					{"title":"Change forum held a roundtable entitled Beyond Spring.","start":"10 Oct 2014","end":"13 Oct 2014"},
					{"title":"Mongoid currently supports the following configuration options, either provided in the mongoid.yml or programatically.","start":" 7 Oct 2014","end":" 9 Oct 2014"}
				]
		  	});
		  }

		// Temporary scripts remove when backend is ready
		$('#header-search').on('submit', function (e) {
			window.location = 'search-results.html';
			e.preventDefault();
		});
	})();
	//-------------------- END PUBLIC METHODS --------------------


})();
