/**
 * Big O Challenge Game
 * Identify time and space complexity of algorithms
 */

class BigOGame {
    constructor() {
        this.questions = [
            // O(1) - Constant Time
            {
                code: 'def get_first(arr):\n    return arr[0]',
                complexityType: 'time',
                options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
                correct: 0,
                explanation: 'Accessing an array element by index is a constant time operation. No matter how large the array is, it always takes the same amount of time to get the first element.'
            },
            {
                code: 'def add_numbers(a, b):\n    return a + b',
                complexityType: 'time',
                options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
                correct: 0,
                explanation: 'Simple arithmetic operations take constant time regardless of the size of the input numbers (assuming fixed-size integers).'
            },

            // O(n) - Linear Time
            {
                code: 'def find_max(arr):\n    max_val = arr[0]\n    for num in arr:\n        if num > max_val:\n            max_val = num\n    return max_val',
                complexityType: 'time',
                options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
                correct: 1,
                explanation: 'The function iterates through each element in the array once. The time complexity grows linearly with the input size, making it O(n).'
            },
            {
                code: 'def sum_array(arr):\n    total = 0\n    for num in arr:\n        total += num\n    return total',
                complexityType: 'time',
                options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
                correct: 1,
                explanation: 'Each element in the array is visited exactly once in a single loop, resulting in linear time complexity O(n).'
            },

            // O(log n) - Logarithmic Time
            {
                code: 'def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1',
                complexityType: 'time',
                options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
                correct: 2,
                explanation: 'Binary search divides the search space in half with each iteration. This halving process results in logarithmic time complexity O(log n).'
            },
            {
                code: 'def power(base, exp):\n    if exp == 0:\n        return 1\n    half = power(base, exp // 2)\n    if exp % 2 == 0:\n        return half * half\n    return base * half * half',
                complexityType: 'time',
                options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
                correct: 2,
                explanation: 'This is an optimized exponentiation algorithm that halves the exponent with each recursive call, resulting in O(log n) time complexity.'
            },

            // O(n²) - Quadratic Time
            {
                code: 'def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr',
                complexityType: 'time',
                options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
                correct: 3,
                explanation: 'Bubble sort uses two nested loops that each iterate through the array, resulting in quadratic time complexity O(n²).'
            },
            {
                code: 'def has_duplicate(arr):\n    for i in range(len(arr)):\n        for j in range(i + 1, len(arr)):\n            if arr[i] == arr[j]:\n                return True\n    return False',
                complexityType: 'time',
                options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
                correct: 3,
                explanation: 'The nested loops compare each element with every other element, resulting in approximately n²/2 comparisons, which is O(n²).'
            },

            // O(n log n) - Linearithmic Time
            {
                code: 'def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)',
                complexityType: 'time',
                options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(n²)'],
                correct: 1,
                explanation: 'Merge sort divides the array (log n levels) and merges (n operations per level), resulting in O(n log n) time complexity.'
            },
            {
                code: 'def quick_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quick_sort(left) + middle + quick_sort(right)',
                complexityType: 'time',
                options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(n²)'],
                correct: 1,
                explanation: 'Quick sort (average case) partitions the array log n times, with each partition requiring n operations, giving O(n log n) time complexity.'
            },

            // Space Complexity
            {
                code: 'def create_array(n):\n    result = []\n    for i in range(n):\n        result.append(i)\n    return result',
                complexityType: 'space',
                options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
                correct: 1,
                explanation: 'The function creates a new array of size n, so the space complexity is O(n) as the space used grows linearly with input size.'
            },
            {
                code: 'def factorial_iterative(n):\n    result = 1\n    for i in range(1, n + 1):\n        result *= i\n    return result',
                complexityType: 'space',
                options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
                correct: 0,
                explanation: 'This iterative approach only uses a constant amount of extra space (the result variable), regardless of input size. Space complexity is O(1).'
            },
            {
                code: 'def factorial_recursive(n):\n    if n <= 1:\n        return 1\n    return n * factorial_recursive(n - 1)',
                complexityType: 'space',
                options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
                correct: 1,
                explanation: 'Each recursive call adds a frame to the call stack. With n recursive calls, the space complexity is O(n) due to the call stack.'
            },

            // More complex examples
            {
                code: 'def fibonacci(n, memo={}):\n    if n in memo:\n        return memo[n]\n    if n <= 1:\n        return n\n    memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)\n    return memo[n]',
                complexityType: 'time',
                options: ['O(1)', 'O(n)', 'O(2^n)', 'O(n²)'],
                correct: 1,
                explanation: 'With memoization, each fibonacci number is calculated only once. Since there are n numbers to calculate, the time complexity is O(n).'
            },
            {
                code: 'def count_chars(s):\n    counts = {}\n    for char in s:\n        counts[char] = counts.get(char, 0) + 1\n    return counts',
                complexityType: 'time',
                options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
                correct: 1,
                explanation: 'The function iterates through each character in the string once. Dictionary operations (get/set) are O(1) average case, so total is O(n).'
            }
        ];

        this.currentQuestion = null;
        this.currentQuestionIndex = -1;
        this.score = 0;
        this.questionsAnswered = 0;

        this.initializeElements();
        this.setupEventListeners();
        this.loadLeaderboard();
    }

    initializeElements() {
        this.codeDisplay = document.getElementById('bigo-code-display');
        this.complexityTypeDisplay = document.getElementById('bigo-complexity-type');
        this.optionsContainer = document.getElementById('bigo-options');
        this.startBtn = document.getElementById('start-bigo-btn');
        this.nextBtn = document.getElementById('next-bigo-btn');
        this.resultDiv = document.getElementById('bigo-result');
        this.scoreDisplay = document.getElementById('bigo-score');
        this.leaderboardDiv = document.getElementById('bigo-leaderboard');
    }

    setupEventListeners() {
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

        if (this.questions.length === 0) {
            this.endGame();
            return;
        }

        // Get random question
        this.currentQuestion = this.questions[Math.floor(Math.random() * this.questions.length)];
        this.questionsAnswered++;

        // Display question
        this.displayQuestion();
    }

    displayQuestion() {
        const q = this.currentQuestion;

        // Show complexity type
        this.complexityTypeDisplay.innerHTML = `
            <span class="bigo-type-badge">${q.complexityType.toUpperCase()} COMPLEXITY</span>
        `;

        // Show code
        this.codeDisplay.innerHTML = `
            <pre><code>${this.escapeHtml(q.code)}</code></pre>
            <p style="margin-top: 1rem; font-weight: 600; color: #2c3e50;">What is the ${q.complexityType} complexity?</p>
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
                <p><strong>Answer:</strong> ${q.options[q.correct]}</p>
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

        let title = 'Complexity Learner';
        if (percentage >= 90) title = 'Big O Master';
        else if (percentage >= 70) title = 'Algorithm Expert';
        else if (percentage >= 50) title = 'Complexity Analyst';

        this.resultDiv.innerHTML = `
            <div class="guess-result-content guess-game-over">
                <h3>🎉 Challenge Complete!</h3>
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
        let leaderboard = JSON.parse(localStorage.getItem('bigoLeaderboard') || '[]');
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
        localStorage.setItem('bigoLeaderboard', JSON.stringify(leaderboard));
    }

    loadLeaderboard() {
        this.displayLeaderboard();
    }

    displayLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('bigoLeaderboard') || '[]');

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
        if (document.getElementById('bigo-code-display')) {
            new BigOGame();
        }
    });
} else {
    if (document.getElementById('bigo-code-display')) {
        new BigOGame();
    }
}
