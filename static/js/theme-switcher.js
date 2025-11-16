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
            },
            'dark-mode': {
                name: 'Dark Mode',
                icon: '🌙',
                colors: {
                    '--primary': '#64b5f6',
                    '--primary-light': '#90caf9',
                    '--secondary': '#b0bec5',
                    '--accent': '#f48fb1',
                    // Improved text readability with higher contrast
                    '--text-dark': '#f5f5f5',
                    '--text-light': '#d0d0d0',
                    '--bg-gradient-1': '#1a1a2e',
                    '--bg-gradient-2': '#16213e',
                    '--bg-gradient-3': '#0f3460',
                    '--bg-gradient-4': '#1a1a2e'
                }
            },
            'warm-sunset': {
                name: 'Warm Sunset',
                icon: '🌅',
                colors: {
                    '--primary': '#ff6b6b',
                    '--primary-light': '#ff8787',
                    '--secondary': '#ffa500',
                    '--accent': '#ee5a6f',
                    '--text-dark': '#2c3e50',
                    '--text-light': '#6c757d',
                    '--bg-gradient-1': '#fff5e6',
                    '--bg-gradient-2': '#ffe4e1',
                    '--bg-gradient-3': '#ffd1dc',
                    '--bg-gradient-4': '#ffe4cc'
                }
            },
            'green-forest': {
                name: 'Green Forest',
                icon: '🌲',
                colors: {
                    '--primary': '#2d6a4f',
                    '--primary-light': '#40916c',
                    '--secondary': '#52b788',
                    '--accent': '#95d5b2',
                    '--text-dark': '#1b4332',
                    '--text-light': '#52b788',
                    '--bg-gradient-1': '#d8f3dc',
                    '--bg-gradient-2': '#b7e4c7',
                    '--bg-gradient-3': '#95d5b2',
                    '--bg-gradient-4': '#d8f3dc'
                }
            }
        };

        this.currentTheme = 'blue-steel';
        this.init();
    }

    init() {
        // Load saved theme
        const savedTheme = localStorage.getItem('siteTheme');
        if (savedTheme && this.themes[savedTheme]) {
            this.currentTheme = savedTheme;
        }

        // Apply initial theme
        this.applyTheme(this.currentTheme);

        // Create UI after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.createUI());
        } else {
            this.createUI();
        }
    }

    createUI() {
        // Create theme switcher container
        const container = document.createElement('div');
        container.id = 'theme-switcher';
        container.className = 'theme-switcher';

        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'theme-toggle-btn';
        toggleBtn.setAttribute('aria-label', 'Switch theme');
        toggleBtn.innerHTML = '🎨';
        toggleBtn.onclick = () => this.togglePanel();

        // Create theme panel
        const panel = document.createElement('div');
        panel.className = 'theme-panel';
        panel.style.display = 'none';

        // Create theme options
        Object.keys(this.themes).forEach(themeKey => {
            const theme = this.themes[themeKey];
            const option = document.createElement('button');
            option.className = 'theme-option';
            if (themeKey === this.currentTheme) {
                option.classList.add('active');
            }
            option.innerHTML = `
                <span class="theme-icon">${theme.icon}</span>
                <span class="theme-name">${theme.name}</span>
            `;
            option.onclick = () => this.switchTheme(themeKey);
            panel.appendChild(option);
        });

        container.appendChild(toggleBtn);
        container.appendChild(panel);
        document.body.appendChild(container);

        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                panel.style.display = 'none';
            }
        });
    }

    togglePanel() {
        const panel = document.querySelector('.theme-panel');
        if (panel) {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }
    }

    switchTheme(themeKey) {
        if (!this.themes[themeKey]) return;

        this.currentTheme = themeKey;
        this.applyTheme(themeKey);
        localStorage.setItem('siteTheme', themeKey);

        // Update active state
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('active');
        });
        event.target.closest('.theme-option').classList.add('active');

        // Close panel
        this.togglePanel();
    }

    applyTheme(themeKey) {
        const theme = this.themes[themeKey];
        if (!theme) return;

        // Apply CSS variables
        const root = document.documentElement;
        Object.keys(theme.colors).forEach(key => {
            root.style.setProperty(key, theme.colors[key]);
        });

        // Add transition class for smooth color changes
        document.body.classList.add('theme-transitioning');
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);

        // Special handling for dark mode
        if (themeKey === 'dark-mode') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }
}

// Initialize theme switcher
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ThemeSwitcher();
    });
} else {
    new ThemeSwitcher();
}
