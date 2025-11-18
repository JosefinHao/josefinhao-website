/**
 * Shared Utility Functions for Josefin Hao Website
 * Provides common functionality used across multiple JavaScript files
 */

/**
 * HTML Escaping Utility
 * Prevents XSS attacks by escaping HTML special characters
 */
const HtmlEscaper = {
    /**
     * Escape HTML special characters
     * @param {string} text - Text to escape
     * @returns {string} - Escaped text safe for HTML insertion
     */
    escapeHtml(text) {
        if (typeof text !== 'string') {
            return '';
        }

        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
};

/**
 * DOM Ready Utility
 * Executes callback when DOM is fully loaded
 * @param {Function} callback - Function to execute when DOM is ready
 */
function onDOMReady(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}

/**
 * Leaderboard Display Utility
 * Common functionality for displaying game leaderboards
 */
class LeaderboardManager {
    /**
     * @param {string} storageKey - LocalStorage key for leaderboard data
     * @param {string} containerId - DOM element ID for leaderboard container
     */
    constructor(storageKey, containerId) {
        this.storageKey = storageKey;
        this.containerId = containerId;
        this.container = null;
    }

    /**
     * Initialize leaderboard display
     */
    init() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            console.error(`Leaderboard container not found: ${this.containerId}`);
            return false;
        }
        return true;
    }

    /**
     * Get leaderboard data from localStorage
     * @param {number} limit - Maximum number of entries to return
     * @returns {Array} - Sorted leaderboard entries
     */
    getEntries(limit = GameConstants.LEADERBOARD_SIZE) {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (!data) {
                return [];
            }

            const entries = JSON.parse(data);
            return Array.isArray(entries) ? entries.slice(0, limit) : [];
        } catch (error) {
            console.error('Error loading leaderboard:', error);
            return [];
        }
    }

    /**
     * Save entry to leaderboard
     * @param {Object} entry - Entry to save
     * @param {string} sortField - Field to sort by
     * @param {boolean} descending - Sort in descending order
     */
    saveEntry(entry, sortField, descending = true) {
        try {
            const entries = this.getEntries(100); // Keep more in storage
            entries.push(entry);

            // Sort entries
            entries.sort((a, b) => {
                const aVal = a[sortField];
                const bVal = b[sortField];
                return descending ? bVal - aVal : aVal - bVal;
            });

            localStorage.setItem(this.storageKey, JSON.stringify(entries));
        } catch (error) {
            console.error('Error saving leaderboard entry:', error);
        }
    }

    /**
     * Display leaderboard table
     * @param {Array} entries - Leaderboard entries
     * @param {Array} columns - Column definitions [{key, label}]
     */
    display(entries, columns) {
        if (!this.container) {
            console.error('Leaderboard not initialized');
            return;
        }

        if (!entries || entries.length === 0) {
            this.container.innerHTML = '<p style="text-align: center; color: #666;">No entries yet. Be the first!</p>';
            return;
        }

        const html = this._buildTableHTML(entries, columns);
        this.container.innerHTML = html;
    }

    /**
     * Build HTML table for leaderboard
     * @private
     */
    _buildTableHTML(entries, columns) {
        let html = `
            <table class="leaderboard-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        ${columns.map(col => `<th>${HtmlEscaper.escapeHtml(col.label)}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
        `;

        entries.forEach((entry, index) => {
            const medal = this._getMedal(index);
            html += `
                <tr>
                    <td>${medal || index + 1}</td>
                    ${columns.map(col => `<td>${HtmlEscaper.escapeHtml(String(entry[col.key] || 'N/A'))}</td>`).join('')}
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;

        return html;
    }

    /**
     * Get medal emoji for top 3 positions
     * @private
     */
    _getMedal(index) {
        const medals = ['🥇', '🥈', '🥉'];
        return index < medals.length ? medals[index] : null;
    }
}

/**
 * Game Constants
 * Centralized constants used across multiple game files
 */
const GameConstants = {
    // Leaderboard
    LEADERBOARD_SIZE: 10,
    LEADERBOARD_STORAGE_LIMIT: 100,

    // Game settings
    QUESTIONS_PER_GAME: 5,

    // Typing game WPM thresholds
    WPM_THRESHOLDS: [
        { wpm: 0, title: "Keyboard Explorer" },
        { wpm: 20, title: "Junior Developer" },
        { wpm: 30, title: "Mid-Level Developer" },
        { wpm: 40, title: "Senior Developer" },
        { wpm: 50, title: "Tech Lead" },
        { wpm: 60, title: "Principal Engineer" },
        { wpm: 70, title: "Distinguished Engineer" },
        { wpm: 80, title: "Code Ninja" },
        { wpm: 90, title: "Keyboard Master" },
        { wpm: 100, title: "Typing God" }
    ],

    // Typing game
    CHARACTERS_PER_WORD: 5,

    // Blockchain game
    DEFAULT_DIFFICULTY: 2,
    BLOCK_REWARD: 6.25,
    MAX_TRANSACTIONS_PER_BLOCK: 5,

    // Neural network game
    DATASET_SIZE: 100,
    CANVAS_RESOLUTION: 4,
    WEIGHT_INIT_MIN: -0.25,
    WEIGHT_INIT_MAX: 0.25,

    // Particle network
    ACTIVE_RADIUS: 200,
    MAX_PARTICLES: 25,
    CONNECTION_DISTANCE: 150,
    FORCE_MULTIPLIER: 0.02,

    // Floating formulas
    FORMULA_GRID_COLUMNS: 8,
    FORMULA_GRID_ROWS: 6,
    FORMULA_STAGGER_DELAY: 250,
    FORMULA_ROTATION_RANGE: 20,
    FORMULA_DRIFT_MIN: 15,
    FORMULA_DRIFT_MAX: 25
};

/**
 * Safe Division Utility
 * Prevents division by zero errors
 */
const MathUtils = {
    /**
     * Safely divide two numbers, returning 0 if divisor is 0
     * @param {number} numerator
     * @param {number} denominator
     * @param {number} epsilon - Minimum threshold for denominator
     * @returns {number}
     */
    safeDivide(numerator, denominator, epsilon = 1e-10) {
        if (Math.abs(denominator) < epsilon) {
            return 0;
        }
        return numerator / denominator;
    },

    /**
     * Calculate distance between two points
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @returns {number}
     */
    distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    },

    /**
     * Clamp a value between min and max
     * @param {number} value
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
};

/**
 * Error Handler Utility
 * Standardized error handling for async operations
 */
const ErrorHandler = {
    /**
     * Handle fetch errors with user-friendly messages
     * @param {Error} error
     * @param {string} context - Context where error occurred
     * @returns {string} - User-friendly error message
     */
    handleFetchError(error, context = 'request') {
        console.error(`Error in ${context}:`, error);

        if (!navigator.onLine) {
            return 'No internet connection. Please check your network.';
        }

        if (error.name === 'TypeError') {
            return 'Network error. Please try again.';
        }

        if (error.name === 'SyntaxError') {
            return 'Invalid response from server. Please try again.';
        }

        return `An error occurred during ${context}. Please try again.`;
    },

    /**
     * Safely parse JSON response
     * @param {Response} response
     * @returns {Promise<Object>}
     */
    async safeJsonParse(response) {
        try {
            return await response.json();
        } catch (error) {
            console.error('JSON parse error:', error);
            throw new Error('Invalid JSON response');
        }
    }
};
