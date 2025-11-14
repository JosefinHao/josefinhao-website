/**
 * Typing Speed Mini-Game
 * Test your coding speed with Python and SQL snippets
 */

class TypingGame {
    constructor() {
        this.codeSnippets = [
            // Python snippets
            "def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)",
            "import pandas as pd\ndf = pd.read_csv('data.csv')\ndf.groupby('category').sum()",
            "class DataProcessor:\n    def __init__(self, data):\n        self.data = data\n    def process(self):\n        return [x * 2 for x in self.data]",
            "with open('file.txt', 'r') as f:\n    lines = f.readlines()\n    words = sum(len(line.split()) for line in lines)",
            "from typing import List, Dict\ndef analyze(data: List[Dict]) -> Dict:\n    return {'count': len(data), 'sum': sum(d['value'] for d in data)}",
            "async def fetch_data(url: str):\n    async with aiohttp.ClientSession() as session:\n        async with session.get(url) as response:\n            return await response.json()",

            // SQL snippets
            "SELECT customer_id, COUNT(*) as order_count\nFROM orders\nGROUP BY customer_id\nHAVING COUNT(*) > 5\nORDER BY order_count DESC;",
            "WITH monthly_sales AS (\n    SELECT DATE_TRUNC('month', date) as month, SUM(amount) as total\n    FROM sales\n    GROUP BY month\n)\nSELECT * FROM monthly_sales WHERE total > 10000;",
            "SELECT p.name, c.name as category, p.price\nFROM products p\nINNER JOIN categories c ON p.category_id = c.id\nWHERE p.price BETWEEN 100 AND 500\nORDER BY p.price;",
            "UPDATE users\nSET status = 'active', last_login = CURRENT_TIMESTAMP\nWHERE email = 'user@example.com' AND verified = true;",
            "CREATE INDEX idx_users_email ON users(email);\nCREATE INDEX idx_orders_date ON orders(order_date DESC);",
            "SELECT u.name, COUNT(o.id) as total_orders, SUM(o.amount) as revenue\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nGROUP BY u.id, u.name;",

            // More Python
            "def quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + middle + quicksort(right)",
            "import requests\nresponse = requests.get('https://api.example.com/data')\nif response.status_code == 200:\n    data = response.json()\n    print(f\"Fetched {len(data)} records\")",
            "from datetime import datetime, timedelta\ndef get_date_range(days: int):\n    end = datetime.now()\n    start = end - timedelta(days=days)\n    return start.strftime('%Y-%m-%d'), end.strftime('%Y-%m-%d')",
        ];

        this.titles = [
            { wpm: 0, title: "Keyboard Explorer" },
            { wpm: 20, title: "Junior Developer" },
            { wpm: 30, title: "Code Apprentice" },
            { wpm: 40, title: "Mid-Level Engineer" },
            { wpm: 50, title: "Senior Developer" },
            { wpm: 60, title: "Tech Lead" },
            { wpm: 70, title: "Coding Ninja" },
            { wpm: 80, title: "Algorithm Wizard" },
            { wpm: 90, title: "Performance Beast" },
            { wpm: 100, title: "10x Engineer" },
        ];

        this.currentSnippet = '';
        this.startTime = null;
        this.endTime = null;
        this.isGameActive = false;
        this.userInput = '';

        this.initializeElements();
        this.loadLeaderboard();
        this.setupEventListeners();
    }

    initializeElements() {
        this.gameContainer = document.getElementById('typing-game-container');
        this.snippetDisplay = document.getElementById('snippet-display');
        this.userInputArea = document.getElementById('user-input');
        this.startBtn = document.getElementById('start-typing-btn');
        this.resetBtn = document.getElementById('reset-typing-btn');
        this.resultsDiv = document.getElementById('typing-results');
        this.leaderboardDiv = document.getElementById('typing-leaderboard');
        this.toggleBtn = document.getElementById('toggle-typing-game');
    }

    setupEventListeners() {
        if (this.startBtn) {
            this.startBtn.addEventListener('click', () => this.startGame());
        }
        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', () => this.resetGame());
        }
        if (this.userInputArea) {
            this.userInputArea.addEventListener('input', (e) => this.handleInput(e));
            this.userInputArea.addEventListener('paste', (e) => e.preventDefault());
        }
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggleGame());
        }
    }

    toggleGame() {
        const isVisible = this.gameContainer.style.display === 'block';
        this.gameContainer.style.display = isVisible ? 'none' : 'block';
        this.toggleBtn.textContent = isVisible ? 'Show Typing Game' : 'Hide Typing Game';

        if (!isVisible) {
            this.resetGame();
        }
    }

    startGame() {
        this.currentSnippet = this.codeSnippets[Math.floor(Math.random() * this.codeSnippets.length)];
        this.snippetDisplay.textContent = this.currentSnippet;
        this.userInputArea.value = '';
        this.userInputArea.disabled = false;
        this.userInputArea.focus();
        this.resultsDiv.innerHTML = '';
        this.startTime = null;
        this.isGameActive = true;
        this.startBtn.disabled = true;
        this.resetBtn.disabled = false;

        // Highlight first character
        this.updateDisplay();
    }

    handleInput(e) {
        if (!this.isGameActive) return;

        // Start timer on first character
        if (!this.startTime && e.target.value.length > 0) {
            this.startTime = Date.now();
        }

        this.userInput = e.target.value;
        this.updateDisplay();

        // Check if completed
        if (this.userInput === this.currentSnippet) {
            this.endGame();
        }
    }

    updateDisplay() {
        let html = '';
        const snippet = this.currentSnippet;
        const input = this.userInput;

        for (let i = 0; i < snippet.length; i++) {
            const char = snippet[i];
            let className = '';

            if (i < input.length) {
                // Already typed
                if (input[i] === char) {
                    className = 'char-correct';
                } else {
                    className = 'char-incorrect';
                }
            } else if (i === input.length) {
                // Current character to type
                className = 'char-current';
            }

            // Preserve whitespace characters
            const displayChar = char === '\n' ? '↵\n' : char === ' ' ? '·' : char;
            html += `<span class="${className}">${this.escapeHtml(displayChar)}</span>`;
        }

        this.snippetDisplay.innerHTML = html;
    }

    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    endGame() {
        this.endTime = Date.now();
        this.isGameActive = false;
        this.userInputArea.disabled = true;
        this.startBtn.disabled = false;

        const results = this.calculateResults();
        this.displayResults(results);
        this.saveToLeaderboard(results);
        this.displayLeaderboard();
    }

    calculateResults() {
        const timeInSeconds = (this.endTime - this.startTime) / 1000;
        const timeInMinutes = timeInSeconds / 60;

        // Calculate WPM (words per minute)
        // Standard: 5 characters = 1 word
        const characters = this.currentSnippet.length;
        const words = characters / 5;
        const wpm = Math.round(words / timeInMinutes);

        // Calculate accuracy
        let correctChars = 0;
        for (let i = 0; i < this.currentSnippet.length; i++) {
            if (this.userInput[i] === this.currentSnippet[i]) {
                correctChars++;
            }
        }
        const accuracy = Math.round((correctChars / this.currentSnippet.length) * 100);

        // Get title based on WPM
        let title = this.titles[0].title;
        for (let i = this.titles.length - 1; i >= 0; i--) {
            if (wpm >= this.titles[i].wpm) {
                title = this.titles[i].title;
                break;
            }
        }

        return {
            wpm,
            accuracy,
            time: timeInSeconds.toFixed(1),
            title,
            timestamp: new Date().toISOString()
        };
    }

    displayResults(results) {
        this.resultsDiv.innerHTML = `
            <div class="typing-results-content">
                <h4>🎉 Completed!</h4>
                <div class="typing-stats">
                    <div class="stat">
                        <div class="stat-value">${results.wpm}</div>
                        <div class="stat-label">WPM</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${results.accuracy}%</div>
                        <div class="stat-label">Accuracy</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${results.time}s</div>
                        <div class="stat-label">Time</div>
                    </div>
                </div>
                <div class="typing-title">
                    <strong>Your Title:</strong> ${results.title}
                </div>
            </div>
        `;
    }

    saveToLeaderboard(results) {
        let leaderboard = JSON.parse(localStorage.getItem('typingLeaderboard') || '[]');

        leaderboard.push({
            wpm: results.wpm,
            accuracy: results.accuracy,
            time: results.time,
            title: results.title,
            timestamp: results.timestamp
        });

        // Sort by WPM descending, then by accuracy
        leaderboard.sort((a, b) => {
            if (b.wpm !== a.wpm) return b.wpm - a.wpm;
            return b.accuracy - a.accuracy;
        });

        // Keep top 10
        leaderboard = leaderboard.slice(0, 10);

        localStorage.setItem('typingLeaderboard', JSON.stringify(leaderboard));
    }

    loadLeaderboard() {
        this.displayLeaderboard();
    }

    displayLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('typingLeaderboard') || '[]');

        if (leaderboard.length === 0) {
            this.leaderboardDiv.innerHTML = '<p style="text-align: center; color: #5f7c8a; font-size: 0.9rem;">No records yet. Be the first!</p>';
            return;
        }

        let html = '<table class="leaderboard-table"><thead><tr><th>Rank</th><th>WPM</th><th>Accuracy</th><th>Title</th></tr></thead><tbody>';

        leaderboard.forEach((entry, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
            html += `
                <tr>
                    <td>${medal}</td>
                    <td><strong>${entry.wpm}</strong></td>
                    <td>${entry.accuracy}%</td>
                    <td>${entry.title}</td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        this.leaderboardDiv.innerHTML = html;
    }

    resetGame() {
        this.currentSnippet = '';
        this.userInput = '';
        this.startTime = null;
        this.endTime = null;
        this.isGameActive = false;
        this.snippetDisplay.textContent = 'Click "Start New Challenge" to begin!';
        this.userInputArea.value = '';
        this.userInputArea.disabled = true;
        this.resultsDiv.innerHTML = '';
        this.startBtn.disabled = false;
        this.resetBtn.disabled = true;
    }
}

// Initialize game when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new TypingGame();
    });
} else {
    new TypingGame();
}
