/**
 * Guess the Output Game
 * Predict what code snippets will output
 */

class GuessOutputGame {
    constructor() {
        this.questions = [
            // Python - Easy
            {
                difficulty: 'easy',
                language: 'Python',
                code: 'x = [1, 2, 3]\ny = x\ny.append(4)\nprint(len(x))',
                options: ['3', '4', 'Error', '[1, 2, 3, 4]'],
                correct: 1,
                explanation: 'Lists are mutable and y is a reference to x, not a copy. When y.append(4) is called, it modifies the same list that x references. So len(x) returns 4.'
            },
            {
                difficulty: 'easy',
                language: 'Python',
                code: 'print("Hello" + " " + "World")',
                options: ['Hello World', 'Hello + World', 'HelloWorld', 'Error'],
                correct: 0,
                explanation: 'String concatenation using + combines the strings together with the space in between, resulting in "Hello World".'
            },
            {
                difficulty: 'easy',
                language: 'Python',
                code: 'x = 5\nprint(x == 5 and x < 10)',
                options: ['True', 'False', '5', 'Error'],
                correct: 0,
                explanation: 'Both conditions are true: x equals 5 AND x is less than 10, so the result is True.'
            },

            // Python - Medium
            {
                difficulty: 'medium',
                language: 'Python',
                code: 'def f(x=[]):\n    x.append(1)\n    return x\nprint(f())\nprint(f())',
                options: ['[1]\n[1]', '[1]\n[1, 1]', '[1, 1]\n[1, 1]', 'Error'],
                correct: 1,
                explanation: 'Default mutable arguments are evaluated once when the function is defined, not each time it\'s called. The same list is reused, so first call returns [1], second call appends to the same list returning [1, 1].'
            },
            {
                difficulty: 'medium',
                language: 'Python',
                code: 'x = {1, 2, 3}\ny = {3, 4, 5}\nprint(len(x & y))',
                options: ['1', '2', '5', '6'],
                correct: 0,
                explanation: 'The & operator performs set intersection. The only common element between {1, 2, 3} and {3, 4, 5} is 3, so the length is 1.'
            },
            {
                difficulty: 'medium',
                language: 'Python',
                code: 'print([i*2 for i in range(3)])',
                options: ['[0, 2, 4]', '[2, 4, 6]', '[0, 1, 2]', '[1, 2, 3]'],
                correct: 0,
                explanation: 'List comprehension multiplies each value from range(3) which gives [0, 1, 2] by 2, resulting in [0, 2, 4].'
            },

            // Python - Hard
            {
                difficulty: 'hard',
                language: 'Python',
                code: 'x = "abc"\nprint(x[::-1])',
                options: ['abc', 'cba', 'bac', 'Error'],
                correct: 1,
                explanation: 'The slice [::-1] reverses the string. Starting from the end and moving backwards, "abc" becomes "cba".'
            },
            {
                difficulty: 'hard',
                language: 'Python',
                code: 'print(type(1/2))',
                options: ["<class 'int'>", "<class 'float'>", "<class 'double'>", 'Error'],
                correct: 1,
                explanation: 'In Python 3, division with / always returns a float, even when dividing integers. 1/2 = 0.5, which is a float type.'
            },
            {
                difficulty: 'hard',
                language: 'Python',
                code: 'd = {"a": 1, "b": 2}\nprint(d.get("c", 0))',
                options: ['None', '0', 'Error', '{"c": 0}'],
                correct: 1,
                explanation: 'The get() method returns the value for the key if it exists, otherwise returns the default value (second argument). Since "c" doesn\'t exist, it returns 0.'
            },

            // SQL - Easy
            {
                difficulty: 'easy',
                language: 'SQL',
                code: 'SELECT COUNT(*) FROM users WHERE age > 18;\n-- Table users has 100 rows, 75 with age > 18',
                options: ['100', '75', '25', 'Error'],
                correct: 1,
                explanation: 'COUNT(*) counts the number of rows that match the WHERE condition. Since 75 users have age > 18, the result is 75.'
            },
            {
                difficulty: 'easy',
                language: 'SQL',
                code: 'SELECT MAX(price) - MIN(price) FROM products;\n-- prices: [10, 20, 30, 40]',
                options: ['10', '30', '40', '50'],
                correct: 1,
                explanation: 'MAX(price) returns 40, MIN(price) returns 10. The difference is 40 - 10 = 30.'
            },

            // SQL - Medium
            {
                difficulty: 'medium',
                language: 'SQL',
                code: 'SELECT DISTINCT category FROM products;\n-- Table has: tech, tech, books, books, tech',
                options: ['tech, tech, books, books, tech', 'tech, books', '2 rows', 'Error'],
                correct: 2,
                explanation: 'DISTINCT removes duplicate values. Even though there are 5 total rows, there are only 2 unique categories: tech and books. The result will be 2 rows.'
            },
            {
                difficulty: 'medium',
                language: 'SQL',
                code: 'SELECT name FROM users\nWHERE city = "NYC"\nORDER BY age DESC\nLIMIT 1;\n-- Returns oldest person in NYC',
                options: ['All NYC users', 'Youngest NYC user', 'Oldest NYC user', 'First NYC user'],
                correct: 2,
                explanation: 'ORDER BY age DESC sorts by age descending (highest first), and LIMIT 1 returns only the first row, which is the oldest person in NYC.'
            },

            // SQL - Hard
            {
                difficulty: 'hard',
                language: 'SQL',
                code: 'SELECT COUNT(DISTINCT user_id) FROM orders;\n-- 100 orders, 25 unique users',
                options: ['100', '25', '75', '125'],
                correct: 1,
                explanation: 'COUNT(DISTINCT user_id) counts only unique user IDs. Even though there are 100 orders, only 25 different users placed them, so the answer is 25.'
            }
        ];

        this.currentQuestion = null;
        this.currentQuestionIndex = -1;
        this.score = 0;
        this.questionsAnswered = 0;
        this.difficulty = 'easy';

        this.initializeElements();
        this.setupEventListeners();
        this.loadLeaderboard();
    }

    initializeElements() {
        this.difficultySelect = document.getElementById('guess-difficulty');
        this.codeDisplay = document.getElementById('guess-code-display');
        this.optionsContainer = document.getElementById('guess-options');
        this.startBtn = document.getElementById('start-guess-btn');
        this.nextBtn = document.getElementById('next-guess-btn');
        this.resultDiv = document.getElementById('guess-result');
        this.scoreDisplay = document.getElementById('guess-score');
        this.leaderboardDiv = document.getElementById('guess-leaderboard');
    }

    setupEventListeners() {
        if (this.difficultySelect) {
            this.difficultySelect.addEventListener('change', (e) => {
                this.difficulty = e.target.value;
            });
        }
        if (this.startBtn) {
            this.startBtn.addEventListener('click', () => this.startGame());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextQuestion());
        }
    }

    startGame() {
        this.score = 0;
        this.questionsAnswered = 0;
        this.updateScore();
        this.resultDiv.innerHTML = '';
        this.startBtn.disabled = true;
        this.nextBtn.disabled = true;
        this.nextQuestion();
    }

    nextQuestion() {
        this.resultDiv.innerHTML = '';
        this.nextBtn.disabled = true;

        // Filter questions by difficulty
        const availableQuestions = this.questions.filter(q =>
            this.difficulty === 'all' || q.difficulty === this.difficulty
        );

        if (availableQuestions.length === 0) {
            this.endGame();
            return;
        }

        // Get random question
        this.currentQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
        this.questionsAnswered++;

        // Display question
        this.displayQuestion();
    }

    displayQuestion() {
        const q = this.currentQuestion;

        // Show code
        this.codeDisplay.innerHTML = `
            <div class="guess-question-header">
                <span class="guess-language-badge">${q.language}</span>
                <span class="guess-difficulty-badge guess-diff-${q.difficulty}">${q.difficulty.toUpperCase()}</span>
            </div>
            <pre><code>${this.escapeHtml(q.code)}</code></pre>
            <p style="margin-top: 1rem; font-weight: 600; color: #2c3e50;">What will this code output?</p>
        `;

        // Show options
        this.optionsContainer.innerHTML = '';
        q.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'guess-option-btn';
            btn.textContent = option;
            btn.onclick = () => this.checkAnswer(index);
            this.optionsContainer.appendChild(btn);
        });
    }

    checkAnswer(selectedIndex) {
        const q = this.currentQuestion;
        const isCorrect = selectedIndex === q.correct;

        // Disable all option buttons
        const optionBtns = this.optionsContainer.querySelectorAll('.guess-option-btn');
        optionBtns.forEach((btn, index) => {
            btn.disabled = true;
            if (index === q.correct) {
                btn.classList.add('guess-option-correct');
            } else if (index === selectedIndex && !isCorrect) {
                btn.classList.add('guess-option-incorrect');
            }
        });

        // Update score
        if (isCorrect) {
            this.score++;
            this.updateScore();
        }

        // Show result and explanation
        this.resultDiv.innerHTML = `
            <div class="guess-result-content ${isCorrect ? 'guess-correct' : 'guess-incorrect'}">
                <h4>${isCorrect ? '✅ Correct!' : '❌ Incorrect'}</h4>
                <p><strong>Explanation:</strong> ${q.explanation}</p>
            </div>
        `;

        // Enable next button or end game
        if (this.questionsAnswered >= 5) {
            setTimeout(() => this.endGame(), 2000);
        } else {
            this.nextBtn.disabled = false;
        }
    }

    updateScore() {
        this.scoreDisplay.textContent = `Score: ${this.score}/${this.questionsAnswered}`;
    }

    endGame() {
        const percentage = Math.round((this.score / this.questionsAnswered) * 100);

        let title = 'Code Newbie';
        if (percentage >= 90) title = 'Code Master';
        else if (percentage >= 70) title = 'Code Expert';
        else if (percentage >= 50) title = 'Code Apprentice';

        this.resultDiv.innerHTML = `
            <div class="guess-result-content guess-game-over">
                <h3>🎉 Game Complete!</h3>
                <div class="guess-final-stats">
                    <div class="stat">
                        <div class="stat-value">${this.score}</div>
                        <div class="stat-label">Correct</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${percentage}%</div>
                        <div class="stat-label">Accuracy</div>
                    </div>
                </div>
                <div class="typing-title">
                    <strong>Your Title:</strong> ${title}
                </div>
                <button class="typing-btn typing-btn-primary" onclick="location.reload()">Play Again</button>
            </div>
        `;

        this.saveToLeaderboard({ score: this.score, total: this.questionsAnswered, percentage, title });
        this.displayLeaderboard();
        this.startBtn.disabled = false;
    }

    saveToLeaderboard(result) {
        let leaderboard = JSON.parse(localStorage.getItem('guessOutputLeaderboard') || '[]');
        leaderboard.push({
            score: result.score,
            total: result.total,
            percentage: result.percentage,
            title: result.title,
            timestamp: new Date().toISOString()
        });

        leaderboard.sort((a, b) => {
            if (b.percentage !== a.percentage) return b.percentage - a.percentage;
            return b.score - a.score;
        });

        leaderboard = leaderboard.slice(0, 10);
        localStorage.setItem('guessOutputLeaderboard', JSON.stringify(leaderboard));
    }

    loadLeaderboard() {
        this.displayLeaderboard();
    }

    displayLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('guessOutputLeaderboard') || '[]');

        if (leaderboard.length === 0) {
            this.leaderboardDiv.innerHTML = '<p style="text-align: center; color: #5f7c8a; font-size: 0.9rem;">No records yet. Be the first!</p>';
            return;
        }

        let html = '<table class="leaderboard-table"><thead><tr><th>Rank</th><th>Score</th><th>Accuracy</th><th>Title</th></tr></thead><tbody>';

        leaderboard.forEach((entry, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
            html += `
                <tr>
                    <td>${medal}</td>
                    <td><strong>${entry.score}/${entry.total}</strong></td>
                    <td>${entry.percentage}%</td>
                    <td>${entry.title}</td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        this.leaderboardDiv.innerHTML = html;
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
}

// Initialize game when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('guess-code-display')) {
            new GuessOutputGame();
        }
    });
} else {
    if (document.getElementById('guess-code-display')) {
        new GuessOutputGame();
    }
}
