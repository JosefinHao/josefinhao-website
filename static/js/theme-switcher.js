/**
 * Dynamic Theme Switcher
 * Allows users to switch between different color themes
 */

class ThemeSwitcher {
    constructor() {
        this.themes = {
            'blue-steel': {
                name: 'Blue Steel',
                icon: '💙',
                colors: {
                    '--primary': '#4a90e2',
                    '--primary-light': '#667eea',
                    '--secondary': '#5f7c8a',
                    '--accent': '#ec407a',
                    '--text-dark': '#2c3e50',
                    '--text-light': '#5f7c8a',
                    // Modern mesh gradient - multiple blue tones for depth
                    '--bg-gradient-1': '#e3f2fd',  // Very light blue
                    '--bg-gradient-2': '#bbdefb',  // Light sky blue
                    '--bg-gradient-3': '#90caf9',  // Bright blue
                    '--bg-gradient-4': '#e1f5fe'   // Cyan tint
                }
            }
        };

        this.currentTheme = 'blue-steel';
        this.init();
    }

    init() {
        // Skip theme application if variables are already set inline
        // This prevents repaint/reflow flash on page load
        const root = document.documentElement;
        const alreadySet = getComputedStyle(root).getPropertyValue('--primary').trim();

        if (alreadySet) {
            // Variables already defined in inline CSS, skip to prevent flash
            return;
        }

        // Fallback: Apply theme only if not already set
        this.applyTheme('blue-steel');
    }

    applyTheme(themeKey) {
        const theme = this.themes[themeKey];
        if (!theme) return;

        // Apply CSS variables
        const root = document.documentElement;
        Object.keys(theme.colors).forEach(key => {
            root.style.setProperty(key, theme.colors[key]);
        });
    }
}

// Initialize theme
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ThemeSwitcher();
    });
} else {
    new ThemeSwitcher();
}
