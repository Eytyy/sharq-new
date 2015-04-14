var SHARQ = (function () {
	//---------------- BEGIN MODULE SCOPE VARIABLES --------------
	var jqueryMap = {
			$dropdown_link             : $('.nav__control__item__w__dropdown > a'),
			$menu_toggle               : $('#menuToggle'),
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
			$close_modal_btn           : $('.closeModal')
		},

		onSearchToggle,
		MESSAGES,
		adjustSharqPostNav,
		openDropDown, closeDropDown,
		openModal, closeModal,
		handleMobileMenuEvents,
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
	adjustSharqPostNav = function () {
		var topOffset        = 78,
			startLimit       = $('.sharq-post__content__main').offset().top - topOffset,
			paperScrollLimit = $('.post__content__body').height() + 500;

			console.log(paperScrollLimit);

		$(window).on('scroll', function () {

			// between main content top and bottom
			if( $(window).scrollTop() > startLimit  && $(window).scrollTop() < paperScrollLimit ) {
				$('.sharq-post__content').addClass('isInsideContainer').removeClass('isOutsideContainer');
				$('.post__nav').css({
					'transform': 'translate3d(0px, ' + 0 + 'px , 0px)'
				})
			}
			// outside main content
			else if( $(window).scrollTop() > paperScrollLimit ) {
				$('.sharq-post__content').addClass('isOutsideContainer').removeClass('isInsideContainer');
				$('.post__nav').css({
					'transform': 'translate3d(0px, ' + paperScrollLimit + 'px, 0px)'
				});
			}
		});

		$("<select />").insertAfter(".post__paper__nav > ul");

		$("<option />", {
			"selected": "selected",
			"value"   : "",
			"text"    : "Go to..."
		}).appendTo("nav select");

		$(".post__paper__nav > ul a").each(function() {
			 var el = $(this);
			 $("<option />", {
			     "value"   : el.attr("href"),
			     "text"    : el.text()
			 }).appendTo("nav select");
		});
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
	//--------------------- END DOM METHODS ----------------------


	//------------------- BEGIN EVENT HANDLERS -------------------

	onSearchToggle = function (e) {
		$('#header-search').toggleClass('isActive');
		e.preventDefault();
	};

	/* This method overrides the openDropDown default behaviour
	 * and attaches new events on links for mobile menu
	 */
	handleMobileMenuEvents = function () {
		$('#admin-header-nav, body').toggleClass('isMobileMenuActive');
		$('.nav__control__item.active').removeClass('active');

		if ($('#admin-header-nav').hasClass('isMobileMenuActive')) {
			console.log('active');
			$('.nav__control__item > a').off('click', APP.openDropDown);
			$('.notification__message a').on('click', APP.openMessageModal);
		}
		else {
			$('.nav__control__item > a').on('click', APP.openDropDown);
			console.log('not active');
		}
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

		jqueryMap.$menu_toggle.on('click', handleMobileMenuEvents);

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
