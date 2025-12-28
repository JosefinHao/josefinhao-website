/**
 * Mobile Navigation Menu Handler
 * Handles hamburger menu toggle and mobile navigation functionality
 */

(function() {
    'use strict';

    // Initialize mobile navigation when DOM is ready
    function initMobileNav() {
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        const mainNav = document.getElementById('mainNav');

        if (!hamburgerMenu || !mainNav) {
            console.error('Mobile navigation elements not found');
            return;
        }

        // Toggle navigation menu
        hamburgerMenu.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
        });

        // Close menu when clicking on a navigation link
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburgerMenu.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = mainNav.contains(event.target);
            const isClickOnHamburger = hamburgerMenu.contains(event.target);

            if (!isClickInsideNav && !isClickOnHamburger && mainNav.classList.contains('active')) {
                hamburgerMenu.classList.remove('active');
                mainNav.classList.remove('active');
            }
        });

        // Handle window resize - close menu if resizing to desktop
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth > 768) {
                    hamburgerMenu.classList.remove('active');
                    mainNav.classList.remove('active');
                }
            }, 250);
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileNav);
    } else {
        initMobileNav();
    }
})();
