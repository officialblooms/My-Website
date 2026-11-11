/*
	Astral by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var $window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$main = $('#main'),
		$panels = $main.children('.panel'),
		$nav = $('#nav'), $nav_links = $nav.children('a');

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1680px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ '361px',   '736px'  ],
			xsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$(function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
				$('#intro-splash').addClass('is-hidden');
			}, 100);
		});

	// Nav.
		$nav_links
			.on('click', function(event) {

				var href = $(this).attr('href');

				// Not a panel link? Bail.
					if (href.charAt(0) != '#'
					||	$panels.filter(href).length == 0)
						return;

				// Prevent default.
					event.preventDefault();
					event.stopPropagation();

				// Change panels.
					if (window.location.hash != href)
						window.location.hash = href;

			});

	// Panels.

		// Initialize.
			(function() {

				var $panel, $link;

				// Get panel, link.
					if (window.location.hash) {

				 		$panel = $panels.filter(window.location.hash);
						$link = $nav_links.filter('[href="' + window.location.hash + '"]');

					}

				// No panel/link? Default to first.
					if (!$panel
					||	$panel.length == 0) {

						$panel = $panels.first();
						$link = $nav_links.first();

					}

				// Deactivate all panels except this one.
					$panels.not($panel)
						.addClass('inactive')
						.hide();

				// Activate link.
					$link
						.addClass('active');

				// Reset scroll.
					$window.scrollTop(0);

			})();

		// Hashchange event.
			$window.on('hashchange', function(event) {

				var $panel, $link;

				// Get panel, link.
					if (window.location.hash) {

				 		$panel = $panels.filter(window.location.hash);
						$link = $nav_links.filter('[href="' + window.location.hash + '"]');

						// No target panel? Bail.
							if ($panel.length == 0)
								return;

					}

				// No panel/link? Default to first.
					else {

						$panel = $panels.first();
						$link = $nav_links.first();

					}

				// Deactivate all panels.
					$panels.addClass('inactive');

				// Deactivate all links.
					$nav_links.removeClass('active');

				// Activate target link.
					$link.addClass('active');

				// Set max/min height.
					$main
						.css('max-height', $main.height() + 'px')
						.css('min-height', $main.height() + 'px');

				// Delay.
					setTimeout(function() {

						// Hide all panels.
							$panels.hide();

						// Show target panel.
							$panel.show();

						// Set new max/min height.
							$main
								.css('max-height', $panel.outerHeight() + 'px')
								.css('min-height', $panel.outerHeight() + 'px');

						// Reset scroll.
							$window.scrollTop(0);

						// Delay.
							window.setTimeout(function() {

								// Activate target panel.
									$panel.removeClass('inactive');

								// Clear max/min height.
									$main
										.css('max-height', '')
										.css('min-height', '');

								// IE: Refresh.
									$window.triggerHandler('--refresh');

								// Unlock.
									locked = false;

							}, (breakpoints.active('small') ? 0 : 500));

					}, 250);

			});

	// IE: Fixes.
		if (browser.name == 'ie') {

			// Fix min-height/flexbox.
				$window.on('--refresh', function() {

					$wrapper.css('height', 'auto');

					window.setTimeout(function() {

						var h = $wrapper.height(),
							wh = $window.height();

						if (h < wh)
							$wrapper.css('height', '100vh');

					}, 0);

				});

				$window.on('resize load', function() {
					$window.triggerHandler('--refresh');
				});

			// Fix intro pic.
				$('.panel.intro').each(function() {

					var $pic = $(this).children('.pic'),
						$img = $pic.children('img');

					$pic
						.css('background-image', 'url(' + $img.attr('src') + ')')
						.css('background-size', 'cover')
						.css('background-position', 'center');

					$img
						.css('visibility', 'hidden');

				});

		}

	// About Me photo lightbox
	const lightbox = document.getElementById('lightbox');
	const lightboxImg = lightbox.querySelector('img');

	const zoomScale = 2.5;	

	let startX = 0, startY = 0, translateX = 0, translateY = 0;

	let isZoomed = false, isDragging = false, hasDragged = false;

	// Calculate maximum allowed movement
	function getBounds() {
		const imgWidth = lightboxImg.offsetWidth;
		const imgHeight = lightboxImg.offsetHeight;

		const containerWidth = lightbox.clientWidth;
		const containerHeight = lightbox.clientHeight;

		// How much the zoomed image extends beyond the viewport
		const maxX = Math.max(
			0,
			(imgWidth * zoomScale - containerWidth) / 2
		);

		const maxY = Math.max(
			0,
			(imgHeight * zoomScale - containerHeight) / 2
		);

		return { maxX, maxY };
	}

	// Keep image inside boundaries
	function constrainPosition() {
		const { maxX, maxY } = getBounds();

		translateX = Math.max(-maxX, Math.min(maxX, translateX));
		translateY = Math.max(-maxY, Math.min(maxY, translateY));
	}

	// Update image position
	function updateTransform() {
		lightboxImg.style.transform =
			`translate(${translateX}px, ${translateY}px) scale(${isZoomed ? zoomScale : 1})`;
	}

	// Zoom in
	function zoomIn() {
		isZoomed = true;
		translateX = 0;
		translateY = 0;

		lightboxImg.classList.add('zoomed');
		updateTransform();
	}

	// Zoom out
	function zoomOut() {
		isZoomed = false;
		translateX = 0;
		translateY = 0;

		lightboxImg.classList.remove('zoomed');
		updateTransform();
	}
		
	// Open lightbox
	document.querySelectorAll('#aboutme img').forEach(img => {
		img.addEventListener('click', () => {
			lightboxImg.src = img.src;
			lightboxImg.alt = img.alt;

			zoomOut();

			lightbox.classList.add('active');
			$body.addClass('lightbox-open');
		});
	});

	// Start dragging
	lightboxImg.addEventListener('pointerdown', e => {
		if (!isZoomed) return;

		e.preventDefault();

		isDragging = true;
		hasDragged = false;

		startX = e.clientX;
		startY = e.clientY;

		lightboxImg.setPointerCapture(e.pointerId);
		lightboxImg.classList.add('dragging');
	});

	let initialTranslateX = 0;
	let initialTranslateY = 0;

	lightboxImg.addEventListener('pointerdown', () => {
		initialTranslateX = translateX;
		initialTranslateY = translateY;
	});

	// Drag image
	lightboxImg.addEventListener('pointermove', e => {
		if (!isDragging) return;

		const deltaX = e.clientX - startX;
		const deltaY = e.clientY - startY;

		if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
			hasDragged = true;
		}

		translateX = initialTranslateX + deltaX;
		translateY = initialTranslateY + deltaY;

		constrainPosition();
		updateTransform();
	});

	// Stop dragging
	function stopDragging() {
		isDragging = false;
		lightboxImg.classList.remove('dragging');
	}

	lightboxImg.addEventListener('pointerup', stopDragging);
	lightboxImg.addEventListener('pointercancel', stopDragging);

	// Click to toggle zoom (but not after dragging)
	lightboxImg.addEventListener('click', e => {
		e.stopPropagation();

		if (hasDragged) {
			hasDragged = false;
			return;
		}

		if (isZoomed) {
			zoomOut();
		} else {
			zoomIn();
		}
	});

	// Scroll wheel moves zoomed image vertically
	lightbox.addEventListener('wheel', e => {
		e.preventDefault();

		if (!isZoomed) return;

		translateY -= e.deltaY;

		constrainPosition();
		updateTransform();
	}, { passive: false });

	function closeLightbox() {
		lightbox.classList.remove('active');
		$body.removeClass('lightbox-open');
		resetZoom();
	}

	// Close when clicking outside the image or Esc
	lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImg) {
			closeLightbox();
    }
	});
	document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
			closeLightbox();
    }
	});

})(jQuery);