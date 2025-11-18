/**
 * Featured Projects Carousel
 * Handles navigation, auto-play, and indicator updates for the homepage carousel
 */

(function() {
    'use strict';

    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCarousel);
    } else {
        initCarousel();
    }

    function initCarousel() {
        const carouselTrack = document.querySelector('.carousel-track');
        const slides = Array.from(document.querySelectorAll('.carousel-slide'));
        const prevButton = document.querySelector('.carousel-nav-prev');
        const nextButton = document.querySelector('.carousel-nav-next');
        const indicators = Array.from(document.querySelectorAll('.carousel-indicator'));

        // Return if carousel elements don't exist
        if (!carouselTrack || slides.length === 0) {
            return;
        }

        let currentSlide = 0;
        const totalSlides = slides.length;
        let autoPlayInterval = null;
        const autoPlayDelay = 10000; // 10 seconds

        /**
         * Update the carousel to show the specified slide
         */
        function goToSlide(index) {
            // Ensure index is within bounds
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;

            // Remove active class from all slides
            slides.forEach(slide => slide.classList.remove('active'));

            // Add active class to current slide
            slides[index].classList.add('active');

            // Move the track
            const slideWidth = slides[0].offsetWidth;
            carouselTrack.style.transform = `translateX(-${index * slideWidth}px)`;

            // Update indicators
            updateIndicators(index);

            // Update current slide
            currentSlide = index;

            // Reset autoplay
            resetAutoPlay();
        }

        /**
         * Update indicator dots to reflect current slide
         */
        function updateIndicators(index) {
            indicators.forEach((indicator, i) => {
                if (i === index) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }

        /**
         * Navigate to next slide
         */
        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        /**
         * Navigate to previous slide
         */
        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        /**
         * Start auto-play
         */
        function startAutoPlay() {
            autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
        }

        /**
         * Stop auto-play
         */
        function stopAutoPlay() {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
        }

        /**
         * Reset auto-play (stop and restart)
         */
        function resetAutoPlay() {
            stopAutoPlay();
            startAutoPlay();
        }

        // Event Listeners
        if (prevButton) {
            prevButton.addEventListener('click', prevSlide);
        }

        if (nextButton) {
            nextButton.addEventListener('click', nextSlide);
        }

        // Indicator click events
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                goToSlide(index);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Only handle if carousel is visible
            const carouselContainer = document.querySelector('.featured-carousel-container');
            if (!carouselContainer || !isElementInViewport(carouselContainer)) {
                return;
            }

            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        });

        // Pause autoplay on hover
        const carouselContainer = document.querySelector('.featured-carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', stopAutoPlay);
            carouselContainer.addEventListener('mouseleave', startAutoPlay);
        }

        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Recalculate slide position on resize
                const slideWidth = slides[0].offsetWidth;
                carouselTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
            }, 250);
        });

        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        const swipeThreshold = 50; // Minimum swipe distance in pixels

        carouselTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carouselTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeDistance = touchStartX - touchEndX;

            if (Math.abs(swipeDistance) > swipeThreshold) {
                if (swipeDistance > 0) {
                    // Swiped left - go to next slide
                    nextSlide();
                } else {
                    // Swiped right - go to previous slide
                    prevSlide();
                }
            }
        }

        // Utility function to check if element is in viewport
        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }

        // Initialize carousel
        // goToSlide(0) already calls resetAutoPlay(), so we don't need to call startAutoPlay() separately
        goToSlide(0);

        console.log('Featured projects carousel initialized');
    }
})();
