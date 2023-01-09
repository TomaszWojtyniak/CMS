"use strict";
(function () {
	// Global variables
	var
		userAgent = navigator.userAgent.toLowerCase(),
		initialDate = new Date(),

		$document = $(document),
		$window = $(window),
		$html = $("html"),
		$body = $("body"),

		isDesktop = $html.hasClass("desktop"),
		isIE = userAgent.indexOf("msie") !== -1 ? parseInt(userAgent.split("msie")[1], 10) : userAgent.indexOf("trident") !== -1 ? 11 : userAgent.indexOf("edge") !== -1 ? 12 : false,
		isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
		windowReady = false,
		isNoviBuilder = false,
		isUserLoggedIn = false,

		plugins = {
			bootstrapModal:          $( '.modal' ),
			bootstrapTabs:           $( '.tabs-custom' ),
			rdMailForm:              $( '.rd-mailform' ),
			rdInputLabel:            $( '.form-label' ),
			regula:                  $( '[data-constraints]' ),
			wow:                     $( '.wow' ),
			owl:                     $( '.owl-carousel' ),
			preloader:               $( '.preloader' ),
			lightGallery:            $( '[data-lightgallery="group"]' ),
			lightGalleryItem:        $( '[data-lightgallery="item"]' ),
			lightDynamicGalleryItem: $( '[data-lightgallery="dynamic"]' ),
			copyrightYear:           $( '.copyright-year' ),
			tabsCorporate:           $( '.tabs-corporate' ),
			tabsGallery:             $( '.tabs-gallery' )
		};

	// Initialize scripts that require a loaded window
	$window.on('load', function () {

		// Page loader & Page transition
		if (plugins.preloader.length && !isNoviBuilder) {
			pageTransition({
				target: document.querySelector( '.page' ),
				delay: 0,
				duration: 500,
				classIn: 'fadeIn',
				classOut: 'fadeOut',
				classActive: 'animated',
				conditions: function (event, link) {
					return link && !/(\#|javascript:void\(0\)|callto:|tel:|mailto:|:\/\/)/.test(link) && !event.currentTarget.hasAttribute('data-lightgallery');
				},
				onTransitionStart: function ( options ) {
					setTimeout( function () {
						plugins.preloader.removeClass('loaded');
					}, options.duration * .75 );
				},
				onReady: function () {
					plugins.preloader.addClass('loaded');
					windowReady = true;
				}
			});
		}
	});

	// Initialize scripts that require a finished document
	$(function () {
		var isNoviBuilder = window.xMode;

		/**
		 * initOwlCarousel
		 * @description  Init owl carousel plugin
		 */
		function initOwlCarousel(c) {
			var aliaces = ["-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"],
				values = [0, 576, 768, 992, 1200, 1600],
				responsive = {};

			for (var j = 0; j < values.length; j++) {
				responsive[values[j]] = {};
				for (var k = j; k >= -1; k--) {
					if (!responsive[values[j]]["items"] && c.attr("data" + aliaces[k] + "items")) {
						responsive[values[j]]["items"] = k < 0 ? 1 : parseInt(c.attr("data" + aliaces[k] + "items"), 10);
					}
					if (!responsive[values[j]]["stagePadding"] && responsive[values[j]]["stagePadding"] !== 0 && c.attr("data" + aliaces[k] + "stage-padding")) {
						responsive[values[j]]["stagePadding"] = k < 0 ? 0 : parseInt(c.attr("data" + aliaces[k] + "stage-padding"), 10);
					}
					if (!responsive[values[j]]["margin"] && responsive[values[j]]["margin"] !== 0 && c.attr("data" + aliaces[k] + "margin")) {
						responsive[values[j]]["margin"] = k < 0 ? 30 : parseInt(c.attr("data" + aliaces[k] + "margin"), 10);
					}
				}
			}

						// Enable custom pagination
						if (c.attr('data-dots-custom')) {
							c.on("initialized.owl.carousel", function (event) {
								var carousel = $(event.currentTarget),
									customPag = $(carousel.attr("data-dots-custom")),
									active = 0;
			
								if (carousel.attr('data-active')) {
									active = parseInt(carousel.attr('data-active'), 10);
								}
			
								carousel.trigger('to.owl.carousel', [active, 300, true]);
								customPag.find("[data-owl-item='" + active + "']").addClass("active");
			
								customPag.find("[data-owl-item]").on('click', function (e) {
									e.preventDefault();
									carousel.trigger('to.owl.carousel', [parseInt(this.getAttribute("data-owl-item"), 10), 300, true]);
								});
			
								carousel.on("translate.owl.carousel", function (event) {
									customPag.find(".active").removeClass("active");
									customPag.find("[data-owl-item='" + event.item.index + "']").addClass("active")
								});
							});
						}
			
						c.on("initialized.owl.carousel", function () {
							initLightGallery($('[data-lightgallery="group-owl"]'), 'lightGallery-in-carousel');
							initLightGalleryItem($('[data-lightgallery="item-owl"]'), 'lightGallery-in-carousel');
						});
			
						c.owlCarousel({
							autoplay: isNoviBuilder ? false : c.attr("data-autoplay") === "true",
							loop: isNoviBuilder ? false : c.attr("data-loop") !== "false",
							items: 1,
							center: c.attr("data-center") === "true",
							dotsContainer: c.attr("data-pagination-class") || false,
							navContainer: c.attr("data-navigation-class") || false,
							mouseDrag: isNoviBuilder ? false : c.attr("data-mouse-drag") !== "false",
							nav: c.attr("data-nav") === "true",
							dots: c.attr("data-dots") === "true",
							dotsEach: c.attr("data-dots-each") ? parseInt(c.attr("data-dots-each"), 10) : false,
							animateIn: c.attr('data-animation-in') ? c.attr('data-animation-in') : 'fadeIn',
							animateOut: c.attr('data-animation-out') ? c.attr('data-animation-out') : 'fadeOut',
							responsive: responsive,
							navText: function () {
								try {
									return JSON.parse(c.attr("data-nav-text"));
								} catch (e) {
									return [];
								}
							}(),
							navClass: function () {
								try {
									return JSON.parse(c.attr("data-nav-class"));
								} catch (e) {
									return ['owl-prev', 'owl-next'];
								}
							}()
						});
		}

		/**
		 * @desc Attach form validation to elements
		 * @param {object} elements - jQuery object
		 */
		function attachFormValidator(elements) {
			// Custom validator - phone number
			regula.custom({
				name: 'PhoneNumber',
				defaultMessage: 'Invalid phone number format',
				validator: function() {
					if ( this.value === '' ) return true;
					else return /^(\+\d)?[0-9\-\(\) ]{5,}$/i.test( this.value );
				}
			});

			for (var i = 0; i < elements.length; i++) {
				var o = $(elements[i]), v;
				o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
				v = o.parent().find(".form-validation");
				if (v.is(":last-child")) o.addClass("form-control-last-child");
			}

			elements.on('input change propertychange blur', function (e) {
				var $this = $(this), results;

				if (e.type !== "blur") if (!$this.parent().hasClass("has-error")) return;
				if ($this.parents('.rd-mailform').hasClass('success')) return;

				if (( results = $this.regula('validate') ).length) {
					for (i = 0; i < results.length; i++) {
						$this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error");
					}
				} else {
					$this.siblings(".form-validation").text("").parent().removeClass("has-error")
				}
			}).regula('bind');

			var regularConstraintsMessages = [
				{
					type: regula.Constraint.Required,
					newMessage: "The text field is required."
				},
				{
					type: regula.Constraint.Email,
					newMessage: "The email is not a valid email."
				},
				{
					type: regula.Constraint.Numeric,
					newMessage: "Only numbers are required"
				},
				{
					type: regula.Constraint.Selected,
					newMessage: "Please choose an option."
				}
			];


			for (var i = 0; i < regularConstraintsMessages.length; i++) {
				var regularConstraint = regularConstraintsMessages[i];

				regula.override({
					constraintType: regularConstraint.type,
					defaultMessage: regularConstraint.newMessage
				});
			}
		}

		/**
		 * @desc Check if all elements pass validation
		 * @param {object} elements - object of items for validation
		 * @param {object} captcha - captcha object for validation
		 * @return {boolean}
		 */
		function isValidated(elements, captcha) {
			var results, errors = 0;

			if (elements.length) {
				for (var j = 0; j < elements.length; j++) {

					var $input = $(elements[j]);
					if ((results = $input.regula('validate')).length) {
						for (k = 0; k < results.length; k++) {
							errors++;
							$input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
						}
					} else {
						$input.siblings(".form-validation").text("").parent().removeClass("has-error")
					}
				}

				if (captcha) {
					if (captcha.length) {
						return validateReCaptcha(captcha) && errors === 0
					}
				}

				return errors === 0;
			}
			return true;
		}

		/**
		 * @desc Initialize the gallery with set of images
		 * @param {object} itemsToInit - jQuery object
		 * @param {string} [addClass] - additional gallery class
		 */
		function initLightGallery ( itemsToInit, addClass ) {
			if ( !isNoviBuilder ) {
				$( itemsToInit ).lightGallery( {
					thumbnail: $( itemsToInit ).attr( "data-lg-thumbnail" ) !== "false",
					selector: "[data-lightgallery='item']",
					autoplay: $( itemsToInit ).attr( "data-lg-autoplay" ) === "true",
					pause: parseInt( $( itemsToInit ).attr( "data-lg-autoplay-delay" ) ) || 5000,
					addClass: addClass,
					mode: $( itemsToInit ).attr( "data-lg-animation" ) || "lg-slide",
					loop: $( itemsToInit ).attr( "data-lg-loop" ) !== "false"
				} );
			}
		}

		/**
		 * @desc Initialize the gallery with dynamic addition of images
		 * @param {object} itemsToInit - jQuery object
		 * @param {string} [addClass] - additional gallery class
		 */
		function initDynamicLightGallery ( itemsToInit, addClass ) {
			if ( !isNoviBuilder ) {
				$( itemsToInit ).on( "click", function () {
					$( itemsToInit ).lightGallery( {
						thumbnail: $( itemsToInit ).attr( "data-lg-thumbnail" ) !== "false",
						selector: "[data-lightgallery='item']",
						autoplay: $( itemsToInit ).attr( "data-lg-autoplay" ) === "true",
						pause: parseInt( $( itemsToInit ).attr( "data-lg-autoplay-delay" ) ) || 5000,
						addClass: addClass,
						mode: $( itemsToInit ).attr( "data-lg-animation" ) || "lg-slide",
						loop: $( itemsToInit ).attr( "data-lg-loop" ) !== "false",
						dynamic: true,
						dynamicEl: JSON.parse( $( itemsToInit ).attr( "data-lg-dynamic-elements" ) ) || []
					} );
				} );
			}
		}

		/**
		 * @desc Initialize the gallery with one image
		 * @param {object} itemToInit - jQuery object
		 * @param {string} [addClass] - additional gallery class
		 */
		function initLightGalleryItem ( itemToInit, addClass ) {
			if ( !isNoviBuilder ) {
				$( itemToInit ).lightGallery( {
					selector: "this",
					addClass: addClass,
					counter: false,
					youtubePlayerParams: {
						modestbranding: 1,
						showinfo: 0,
						rel: 0,
						controls: 0
					},
					vimeoPlayerParams: {
						byline: 0,
						portrait: 0
					}
				} );
			}
		}

		// Additional class on html if mac os.
		if (navigator.platform.match(/(Mac)/i)) {
			$html.addClass("mac-os");
		}

		// Adds some loosing functionality to IE browsers (IE Polyfills)
		if (isIE) {
			if (isIE === 12) $html.addClass("ie-edge");
			if (isIE === 11) $html.addClass("ie-11");
			if (isIE < 10) $html.addClass("lt-ie-10");
			if (isIE < 11) $html.addClass("ie-10");
		}

		// Bootstrap tabs
		if (plugins.bootstrapTabs.length) {
			for (var i = 0; i < plugins.bootstrapTabs.length; i++) {
				var bootstrapTabsItem = $(plugins.bootstrapTabs[i]);

				//If have slick carousel inside tab - resize slick carousel on click
				if (bootstrapTabsItem.find('.slick-slider').length) {
					bootstrapTabsItem.find('.tabs-custom-list > li > a').on('click', $.proxy(function () {
						var $this = $(this);
						var setTimeOutTime = isNoviBuilder ? 1500 : 300;

						setTimeout(function () {
							$this.find('.tab-content .tab-pane.active .slick-slider').slick('setPosition');
						}, setTimeOutTime);
					}, bootstrapTabsItem));
				}
			}
		}

		// Copyright Year (Evaluates correct copyright year)
		if (plugins.copyrightYear.length) {
			plugins.copyrightYear.text(initialDate.getFullYear());
		}

		// WOW
		if ($html.hasClass("wow-animation") && plugins.wow.length && !isNoviBuilder && isDesktop) {
			new WOW().init();
		}

		// RD Input Label
		if (plugins.rdInputLabel.length) {
			plugins.rdInputLabel.RDInputLabel();
		}

		// Regula
		if (plugins.regula.length) {
			attachFormValidator(plugins.regula);
		}

		// Tabs corporate
		if (plugins.tabsCorporate.length) {
			var item = $('.tabs-corporate > .nav-tabs .nav-link'),
				galleryItem = plugins.tabsGallery;
			if (!isNoviBuilder) {

				for (var i = 0; i < item.length; i++) {
					$(item[i]).append("<span class='nav-link-hover'>" + $(item[i]).find('.nav-link-main').html() + "</span>");
				}

				plugins.tabsCorporate.find('.close-content-box').on('click', function (e) {
					e.preventDefault();
					$('.tabs-corporate > .nav-tabs .nav-link:first').tab('show');
				})
				plugins.tabsCorporate.find('[data-toggle="tab"]').on('click', function () {
					setTimeout(function () {
						$('.modal').modal('hide');
					}, 100);
				});
			}
		}

		if (!isUserLoggedIn) {
			$("#panel_button").hide();

		} else {
			$("#login_button").text("Log out");
			loadMovieList();
		}

		$("#login_button").on("click", function() {
			loadMovieList();
			isUserLoggedIn = true;
		});

		function loadView() {

			// Owl carousel
			if ( plugins.owl.length ) {
				for ( var i = 0; i < plugins.owl.length; i++ ) {
					var carousel = $( plugins.owl[ i ] );
					plugins.owl[ i ].owl = carousel;
					initOwlCarousel( carousel );
				}
			}

			// lightGallery
			if (plugins.lightGallery.length) {
				for (var i = 0; i < plugins.lightGallery.length; i++) {
					initLightGallery(plugins.lightGallery[i]);
				}
			}

			// lightGallery item
			if (plugins.lightGalleryItem.length) {
				// Filter carousel items
				var notCarouselItems = [];

				for (var z = 0; z < plugins.lightGalleryItem.length; z++) {
					if (!$(plugins.lightGalleryItem[z]).parents('.owl-carousel').length &&
						!$(plugins.lightGalleryItem[z]).parents('.swiper-slider').length &&
						!$(plugins.lightGalleryItem[z]).parents('.slick-slider').length) {
						notCarouselItems.push(plugins.lightGalleryItem[z]);
					}
				}

				plugins.lightGalleryItem = notCarouselItems;

				for (var i = 0; i < plugins.lightGalleryItem.length; i++) {
					initLightGalleryItem(plugins.lightGalleryItem[i]);
				}
			}

			// Dynamic lightGallery
			if (plugins.lightDynamicGalleryItem.length) {
				for (var i = 0; i < plugins.lightDynamicGalleryItem.length; i++) {
					initDynamicLightGallery(plugins.lightDynamicGalleryItem[i]);
				}
			}

			// Load gallery tabs
			if (plugins.tabsCorporate.length) {
				var item = $('.tabs-corporate > .nav-tabs .nav-link'),
					galleryItem = plugins.tabsGallery;
				if (!isNoviBuilder) {

					$(galleryItem).find('[data-toggle="tab"]').on('click', function () {
						$(galleryItem).find('.nav-tabs').animate({
							height: "hide",
							top: "-100px",
							opacity: 0
						}, 500);
					});

					$(galleryItem).find('.back-to-gallery').on('click', function () {
						$(galleryItem).find('.nav-tabs').animate({
							height: "show",
							top: "0",
							opacity: 1
						}, 500);

						$(galleryItem).find('.tab-pane').removeClass('active').addClass('fade');
						$(galleryItem).find('.nav-link').removeClass('active');
					});

				} else {
					$(galleryItem).find('.tab-pane:first').addClass('active show');
					$(galleryItem).find('.nav-link:first').addClass('active');
				}

			}

			// Modal custom
			if (!isNoviBuilder) {
				$('[data-toggle="modal"]').on("click", function () {
					$('.hide-on-modal').addClass('hide').removeClass('fade show')
				});
				$('.modal').on('hide.bs.modal', function () {
					$('.hide-on-modal').removeClass('hide').addClass('fade show');
				});

				$('#privacy').on('show.bs.modal', function () {
					plugins.tabsCorporate.find('.tab-pane').removeClass('show');
					$('.modal').modal('hide');
				});
				$('#privacy').on('hide.bs.modal', function () {
					plugins.tabsCorporate.find('.tab-pane.active').addClass('show');
				});
			} else {
				$("[data-dismiss='modal'], [data-toggle='modal']").on("click", function (e) {
					e.preventDefault();
					e.stopPropagation();
				});
			}
		}

		function loadMovieList() {
			let text = {
				"movie_lists": [
					{
						"list_id": 1,
						"list_name": "Movies with Tom Hanks",
						"description": "Description",
						"movies": [
							{
								"movie_id": "1",
								"movie_name": "Movie 1",
								"year": 2022,
								"category": "Drama",
								"movie_rating": 5.0,
								"movie_url" : "../sample-data/gump.jpg"
							},
							{
								"movie_id": "2",
								"movie_name": "Movie 2",
								"year": 2021,
								"category": "Drama",
								"movie_rating": 4.0,
								"movie_url" : "images/gallery-lifestyle-07-970x524.jpg"
							},
							{
								"movie_id": "3",
								"movie_name": "Movie 3",
								"year": 2020,
								"category": "Comedy",
								"movie_rating": 3.6,
								"movie_url" : "images/gallery-lifestyle-07-970x524.jpg"
							}
						]
					},
					{
						"list_id": 2,
						"list_name": "Harry Potter",
						"description": "Description",
						"movies": [
							{
								"movie_id": "1",
								"movie_name": "Movie 1",
								"year": 2022,
								"category": "Drama",
								"movie_rating": 5.0,
								"movie_url" : "../sample-data/harry_potter_kamien.jpg"
							},
							{
								"movie_id": "2",
								"movie_name": "Movie 2",
								"year": 2021,
								"category": "Drama",
								"movie_rating": 4.0,
								"movie_url" : "images/gallery-lifestyle-07-970x524.jpg"
							},
							{
								"movie_id": "3",
								"movie_name": "Movie 3",
								"year": 2020,
								"category": "Comedy",
								"movie_rating": 3.6,
								"movie_url" : "images/gallery-lifestyle-07-970x524.jpg"
							}
						]
					},
					{
						"list_id": 3,
						"list_name": "Marvel",
						"description": "Description",
						"movies": [
							{
								"movie_id": "1",
								"movie_name": "Avengers End Game",
								"year": 2022,
								"category": "Drama",
								"movie_rating": 5.0,
								"movie_url" : "../sample-data/avengers_end_game.jpg"
							},
							{
								"movie_id": "2",
								"movie_name": "Movie 2",
								"year": 2021,
								"category": "Drama",
								"movie_rating": 4.0,
								"movie_url" : "images/gallery-lifestyle-07-970x524.jpg"
							},
							{
								"movie_id": "3",
								"movie_name": "Movie 3",
								"year": 2020,
								"category": "Comedy",
								"movie_rating": 3.6,
								"movie_url" : "images/gallery-lifestyle-07-970x524.jpg"
							}
						]
					}
				]
			}
			var obj = $.parseJSON(JSON.stringify(text));
			var list_names = [];
			var all_movies_list = [];
			var lists_ids = ["#lifestyle", "#portrait", "#fashion", "#nature", "#city", "#country"];
			$.each(obj, function(key ,value) {
				$.each(value, function(key, value) {
					$("#main-gallery").append('<li class="nav-item" role="presentation"><a class="nav-link" href="#tabs-gallery-' + value.list_id + '" data-toggle="tab"><img src="' + value.movies[0].movie_url +'" alt="" width="180" height="180"/><span>' + value.list_name + '</span></a></li>')
					list_names.push(value.list_name);
					var movies_list = [];
					$.each(value.movies, function(key, value) {
						movies_list.push(`<a class="gallery-item" href="` + value.movie_url + `" data-lightgallery="item">
							<figure><img src="` + value.movie_url + `" alt="" width="970" height="524"/>
							</figure>
							<div class="caption"><span class="icon novi-icon fa-expand"></span></div>
					    </a>`)
					});
					all_movies_list.push(movies_list);
					movies_list = [];
				});
			});

			list_names.forEach((element, index) => {
				$(lists_ids[index] + "-name").text(element);
			});

			all_movies_list.forEach((element, index) => {
				$(lists_ids[index] + "-list").append(element);
			});
			loadView();
			
		}
	});
}());
