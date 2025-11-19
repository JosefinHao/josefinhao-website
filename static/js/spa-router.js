/**
 * SPA Router - Single Page Application Navigation
 * Handles client-side routing to avoid page reloads and maintain persistent background/floating formulas
 */

(function() {
    'use strict';

    // Configuration
    const CONTENT_CONTAINER_ID = 'spa-content';
    const MODALS_CONTAINER_ID = 'spa-modals';

    // Track current page to avoid redundant loads
    let currentPath = window.location.pathname;

    /**
     * Initialize the SPA router
     */
    function initRouter() {
        // Intercept all navigation link clicks
        document.addEventListener('click', handleLinkClick);

        // Handle browser back/forward buttons
        window.addEventListener('popstate', handlePopState);

        console.log('SPA Router initialized');
    }

    /**
     * Handle click events on navigation links
     */
    function handleLinkClick(e) {
        const link = e.target.closest('a');

        if (!link) return;

        // Get the href
        const href = link.getAttribute('href');

        // Skip if:
        // - No href
        // - External link (starts with http:// or https://)
        // - Same page anchor link (starts with #)
        // - Download link or special attributes
        // - Link has data-no-spa attribute
        if (!href ||
            href.startsWith('http://') ||
            href.startsWith('https://') ||
            href.startsWith('#') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:') ||
            link.hasAttribute('download') ||
            link.hasAttribute('data-no-spa') ||
            link.target === '_blank') {
            return;
        }

        // Prevent default navigation
        e.preventDefault();

        // Navigate to the new page
        navigateTo(href);
    }

    /**
     * Handle browser back/forward button
     */
    function handlePopState(e) {
        const path = window.location.pathname;
        loadPage(path, false); // Don't push to history again
    }

    /**
     * Navigate to a new page
     */
    function navigateTo(path) {
        // Don't reload if already on this page
        if (path === currentPath) {
            return;
        }

        loadPage(path, true);
    }

    /**
     * Load page content via AJAX
     */
    async function loadPage(path, pushState = true) {
        try {
            // Get content container
            const container = document.getElementById(CONTENT_CONTAINER_ID);
            if (!container) {
                console.error('Content container not found, falling back to normal navigation');
                window.location.href = path;
                return;
            }

            // Fetch the page content
            const response = await fetch(path, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-SPA-Request': 'true'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const html = await response.text();

            // Parse the response to extract content and metadata
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Extract the content
            const newContent = doc.querySelector(`#${CONTENT_CONTAINER_ID}`);
            if (!newContent) {
                throw new Error('Content container not found in response');
            }

            // Extract the modals (if any)
            const newModals = doc.querySelector(`#${MODALS_CONTAINER_ID}`);
            const modalsContainer = document.getElementById(MODALS_CONTAINER_ID);

            // Extract the title
            const newTitle = doc.querySelector('title');
            if (newTitle) {
                document.title = newTitle.textContent;
            }

            // Extract page-specific data attribute
            const newBodyPage = doc.body.getAttribute('data-page');

            // Update the content instantly
            container.innerHTML = newContent.innerHTML;

            // Update the modals (if both containers exist)
            if (modalsContainer && newModals) {
                modalsContainer.innerHTML = newModals.innerHTML;
            } else if (modalsContainer) {
                // Clear modals if new page has none
                modalsContainer.innerHTML = '';
            }

            // Update body data-page attribute
            if (newBodyPage) {
                document.body.setAttribute('data-page', newBodyPage);
            } else {
                document.body.removeAttribute('data-page');
            }

            // Update navigation active state
            updateNavigation(path);

            // Scroll to top instantly
            window.scrollTo({ top: 0, behavior: 'instant' });

            // Re-initialize page-specific JavaScript
            initializePageScripts(path, doc);

            // Update browser history
            if (pushState) {
                window.history.pushState({ path }, '', path);
            }

            // Update current path
            currentPath = path;

            console.log(`Navigated to: ${path}`);

        } catch (error) {
            console.error('Error loading page:', error);
            // Fall back to normal navigation on error
            window.location.href = path;
        }
    }

    /**
     * Update navigation active state
     */
    function updateNavigation(path) {
        // Remove active class from all nav links
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current page link
        document.querySelectorAll('nav a').forEach(link => {
            const href = link.getAttribute('href');
            if (href === path || (path === '/' && href === '/')) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Initialize page-specific JavaScript after content swap
     */
    function initializePageScripts(path, newDoc) {
        // Extract and execute scripts from the new page's extra_js block
        const newScripts = newDoc.querySelectorAll('script[src]');
        const scriptsToLoad = [];

        newScripts.forEach(script => {
            const src = script.getAttribute('src');
            // Check if this script is already loaded
            if (!document.querySelector(`script[src="${src}"]`)) {
                scriptsToLoad.push(src);
            }
        });

        // Load all new scripts
        if (scriptsToLoad.length > 0) {
            Promise.all(scriptsToLoad.map(src => loadScript(src)))
                .then(() => {
                    // After all scripts load, initialize page-specific features
                    initializePageFeatures(path);
                })
                .catch(error => {
                    console.error('Error loading scripts:', error);
                    initializePageFeatures(path);
                });
        } else {
            // No new scripts to load, just initialize
            initializePageFeatures(path);
        }
    }

    /**
     * Load a script dynamically
     */
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load: ${src}`));
            document.body.appendChild(script);
        });
    }

    /**
     * Initialize page-specific features after scripts are loaded
     */
    function initializePageFeatures(path) {
        // Re-initialize carousel on homepage
        if (path === '/') {
            if (window.initCarousel && typeof window.initCarousel === 'function') {
                window.initCarousel();
            }
        }

        // Dispatch event for games to initialize
        if (path === '/games' || path === '/cat-cafe') {
            const event = new CustomEvent('spa-page-loaded', {
                detail: { path: path }
            });
            document.dispatchEvent(event);
        }
    }

    // Wait for DOM to be ready before initializing
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRouter);
    } else {
        initRouter();
    }

    // Expose navigation function globally for programmatic navigation
    window.spaNavigate = navigateTo;

})();
