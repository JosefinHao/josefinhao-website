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

            // More Python algorithms
            "def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1",
            "def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)",
            "def dfs(graph, start, visited=None):\n    if visited is None:\n        visited = set()\n    visited.add(start)\n    for neighbor in graph[start]:\n        if neighbor not in visited:\n            dfs(graph, neighbor, visited)\n    return visited",
            "from collections import deque\ndef bfs(graph, start):\n    visited = set([start])\n    queue = deque([start])\n    while queue:\n        vertex = queue.popleft()\n        for neighbor in graph[vertex]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)\n    return visited",
            "def kadane_algorithm(arr):\n    max_sum = float('-inf')\n    current_sum = 0\n    for num in arr:\n        current_sum = max(num, current_sum + num)\n        max_sum = max(max_sum, current_sum)\n    return max_sum",
            "def knapsack(weights, values, capacity):\n    n = len(weights)\n    dp = [[0] * (capacity + 1) for _ in range(n + 1)]\n    for i in range(1, n + 1):\n        for w in range(capacity + 1):\n            if weights[i-1] <= w:\n                dp[i][w] = max(dp[i-1][w], values[i-1] + dp[i-1][w-weights[i-1]])\n            else:\n                dp[i][w] = dp[i-1][w]\n    return dp[n][capacity]",
            "def longest_common_subsequence(s1, s2):\n    m, n = len(s1), len(s2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if s1[i-1] == s2[j-1]:\n                dp[i][j] = dp[i-1][j-1] + 1\n            else:\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    return dp[m][n]",
            "import heapq\ndef dijkstra(graph, start):\n    distances = {node: float('inf') for node in graph}\n    distances[start] = 0\n    pq = [(0, start)]\n    while pq:\n        current_distance, current_node = heapq.heappop(pq)\n        if current_distance > distances[current_node]:\n            continue\n        for neighbor, weight in graph[current_node]:\n            distance = current_distance + weight\n            if distance < distances[neighbor]:\n                distances[neighbor] = distance\n                heapq.heappush(pq, (distance, neighbor))\n    return distances",
            "def edit_distance(str1, str2):\n    m, n = len(str1), len(str2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(m + 1):\n        dp[i][0] = i\n    for j in range(n + 1):\n        dp[0][j] = j\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if str1[i-1] == str2[j-1]:\n                dp[i][j] = dp[i-1][j-1]\n            else:\n                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])\n    return dp[m][n]",
            "def is_valid_parentheses(s):\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top:\n                return False\n        else:\n            stack.append(char)\n    return not stack",
            "def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return None",
            "def longest_palindrome(s):\n    if not s:\n        return \"\"\n    start, max_len = 0, 0\n    for i in range(len(s)):\n        len1 = expand_around_center(s, i, i)\n        len2 = expand_around_center(s, i, i + 1)\n        current_max = max(len1, len2)\n        if current_max > max_len:\n            max_len = current_max\n            start = i - (current_max - 1) // 2\n    return s[start:start + max_len]",
            "def merge_intervals(intervals):\n    if not intervals:\n        return []\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]\n    for current in intervals[1:]:\n        if current[0] <= merged[-1][1]:\n            merged[-1][1] = max(merged[-1][1], current[1])\n        else:\n            merged.append(current)\n    return merged",
            "def generate_permutations(nums):\n    def backtrack(path, used):\n        if len(path) == len(nums):\n            result.append(path[:])\n            return\n        for i in range(len(nums)):\n            if used[i]:\n                continue\n            path.append(nums[i])\n            used[i] = True\n            backtrack(path, used)\n            path.pop()\n            used[i] = False\n    result = []\n    backtrack([], [False] * len(nums))\n    return result",
            "def coin_change(coins, amount):\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for i in range(1, amount + 1):\n        for coin in coins:\n            if coin <= i:\n                dp[i] = min(dp[i], dp[i - coin] + 1)\n    return dp[amount] if dp[amount] != float('inf') else -1",

            // More SQL queries
            "SELECT u.name, COUNT(o.id) as order_count, SUM(o.total) as revenue\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nWHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)\nGROUP BY u.id\nHAVING order_count > 5\nORDER BY revenue DESC;",
            "WITH RECURSIVE dates AS (\n    SELECT DATE('2024-01-01') as date\n    UNION ALL\n    SELECT DATE_ADD(date, INTERVAL 1 DAY)\n    FROM dates\n    WHERE date < '2024-12-31'\n)\nSELECT d.date, COALESCE(SUM(s.amount), 0) as daily_sales\nFROM dates d\nLEFT JOIN sales s ON DATE(s.created_at) = d.date\nGROUP BY d.date;",
            "SELECT p.category, p.name, p.price,\n    ROW_NUMBER() OVER (PARTITION BY p.category ORDER BY p.price DESC) as rank\nFROM products p\nQUALIFY rank <= 3;",
            "SELECT customer_id,\n    FIRST_VALUE(order_date) OVER (PARTITION BY customer_id ORDER BY order_date) as first_order,\n    LAST_VALUE(order_date) OVER (PARTITION BY customer_id ORDER BY order_date\n        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) as last_order\nFROM orders;",
            "SELECT DATE_TRUNC('month', order_date) as month,\n    SUM(amount) as monthly_sales,\n    LAG(SUM(amount)) OVER (ORDER BY DATE_TRUNC('month', order_date)) as prev_month_sales,\n    ROUND((SUM(amount) - LAG(SUM(amount)) OVER (ORDER BY DATE_TRUNC('month', order_date))) / \n        LAG(SUM(amount)) OVER (ORDER BY DATE_TRUNC('month', order_date)) * 100, 2) as growth_rate\nFROM orders\nGROUP BY month;",
            "WITH user_activity AS (\n    SELECT user_id, action_type, action_date,\n        LAG(action_date) OVER (PARTITION BY user_id ORDER BY action_date) as prev_action_date\n    FROM user_actions\n)\nSELECT user_id, AVG(DATEDIFF(action_date, prev_action_date)) as avg_days_between_actions\nFROM user_activity\nWHERE prev_action_date IS NOT NULL\nGROUP BY user_id;",
            "SELECT p.product_name,\n    CASE\n        WHEN p.price < 50 THEN 'Budget'\n        WHEN p.price BETWEEN 50 AND 200 THEN 'Mid-range'\n        ELSE 'Premium'\n    END as price_tier,\n    COUNT(o.id) as times_ordered\nFROM products p\nLEFT JOIN order_items o ON p.id = o.product_id\nGROUP BY p.id, price_tier\nORDER BY times_ordered DESC;",
            "SELECT e1.name as employee, e2.name as manager, e1.salary\nFROM employees e1\nLEFT JOIN employees e2 ON e1.manager_id = e2.id\nWHERE e1.salary > (SELECT AVG(salary) FROM employees WHERE department_id = e1.department_id);",
            "WITH RECURSIVE org_chart AS (\n    SELECT id, name, manager_id, 1 as level\n    FROM employees\n    WHERE manager_id IS NULL\n    UNION ALL\n    SELECT e.id, e.name, e.manager_id, o.level + 1\n    FROM employees e\n    JOIN org_chart o ON e.manager_id = o.id\n)\nSELECT * FROM org_chart ORDER BY level, name;",
            "SELECT customer_id, order_date,\n    NTILE(4) OVER (ORDER BY order_date) as quarter\nFROM orders\nWHERE order_date BETWEEN '2024-01-01' AND '2024-12-31';",

            // JavaScript snippets
            "const debounce = (func, delay) => {\n    let timeout;\n    return (...args) => {\n        clearTimeout(timeout);\n        timeout = setTimeout(() => func.apply(this, args), delay);\n    };\n};",
            "const throttle = (func, limit) => {\n    let inThrottle;\n    return function(...args) {\n        if (!inThrottle) {\n            func.apply(this, args);\n            inThrottle = true;\n            setTimeout(() => inThrottle = false, limit);\n        }\n    };\n};",
            "const deepClone = (obj) => {\n    if (obj === null || typeof obj !== 'object') return obj;\n    if (obj instanceof Date) return new Date(obj.getTime());\n    if (obj instanceof Array) return obj.map(item => deepClone(item));\n    const clonedObj = {};\n    for (let key in obj) {\n        if (obj.hasOwnProperty(key)) {\n            clonedObj[key] = deepClone(obj[key]);\n        }\n    }\n    return clonedObj;\n};",
            "const curry = (fn) => {\n    return function curried(...args) {\n        if (args.length >= fn.length) {\n            return fn.apply(this, args);\n        } else {\n            return function(...moreArgs) {\n                return curried.apply(this, args.concat(moreArgs));\n            };\n        }\n    };\n};",
            "const memoize = (fn) => {\n    const cache = new Map();\n    return (...args) => {\n        const key = JSON.stringify(args);\n        if (cache.has(key)) {\n            return cache.get(key);\n        }\n        const result = fn(...args);\n        cache.set(key, result);\n        return result;\n    };\n};",
            "const promiseAll = (promises) => {\n    return new Promise((resolve, reject) => {\n        const results = [];\n        let completed = 0;\n        promises.forEach((promise, index) => {\n            Promise.resolve(promise)\n                .then(result => {\n                    results[index] = result;\n                    completed++;\n                    if (completed === promises.length) {\n                        resolve(results);\n                    }\n                })\n                .catch(reject);\n        });\n    });\n};",
            "const flatten = (arr) => {\n    return arr.reduce((acc, val) => {\n        return Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val);\n    }, []);\n};",
            "const groupBy = (array, key) => {\n    return array.reduce((result, item) => {\n        const groupKey = typeof key === 'function' ? key(item) : item[key];\n        (result[groupKey] = result[groupKey] || []).push(item);\n        return result;\n    }, {});\n};",
            "const pipe = (...fns) => {\n    return (initialValue) => {\n        return fns.reduce((value, fn) => fn(value), initialValue);\n    };\n};",
            "const compose = (...fns) => {\n    return (initialValue) => {\n        return fns.reduceRight((value, fn) => fn(value), initialValue);\n    };\n};",
            "const retry = async (fn, maxAttempts = 3, delay = 1000) => {\n    for (let attempt = 1; attempt <= maxAttempts; attempt++) {\n        try {\n            return await fn();\n        } catch (error) {\n            if (attempt === maxAttempts) throw error;\n            await new Promise(resolve => setTimeout(resolve, delay));\n        }\n    }\n};",

            // More Python - Data structures
            "class LinkedList:\n    class Node:\n        def __init__(self, data):\n            self.data = data\n            self.next = None\n\n    def __init__(self):\n        self.head = None\n\n    def insert_at_beginning(self, data):\n        new_node = self.Node(data)\n        new_node.next = self.head\n        self.head = new_node",
            "class Stack:\n    def __init__(self):\n        self.items = []\n\n    def push(self, item):\n        self.items.append(item)\n\n    def pop(self):\n        if not self.is_empty():\n            return self.items.pop()\n        return None\n\n    def is_empty(self):\n        return len(self.items) == 0",
            "class Queue:\n    def __init__(self):\n        self.items = []\n\n    def enqueue(self, item):\n        self.items.insert(0, item)\n\n    def dequeue(self):\n        if not self.is_empty():\n            return self.items.pop()\n        return None\n\n    def is_empty(self):\n        return len(self.items) == 0",
            "class MinHeap:\n    def __init__(self):\n        self.heap = []\n\n    def parent(self, i):\n        return (i - 1) // 2\n\n    def left_child(self, i):\n        return 2 * i + 1\n\n    def right_child(self, i):\n        return 2 * i + 2\n\n    def insert(self, key):\n        self.heap.append(key)\n        self._heapify_up(len(self.heap) - 1)",
            "class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end_of_word = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n\n    def insert(self, word):\n        node = self.root\n        for char in word:\n            if char not in node.children:\n                node.children[char] = TrieNode()\n            node = node.children[char]\n        node.is_end_of_word = True",

            // More Python - Advanced patterns
            "def decorator_with_args(prefix):\n    def decorator(func):\n        @wraps(func)\n        def wrapper(*args, **kwargs):\n            print(f\"{prefix}: Calling {func.__name__}\")\n            result = func(*args, **kwargs)\n            print(f\"{prefix}: Finished {func.__name__}\")\n            return result\n        return wrapper\n    return decorator",
            "@dataclass\nclass Point:\n    x: float\n    y: float\n\n    def distance_from_origin(self) -> float:\n        return (self.x ** 2 + self.y ** 2) ** 0.5\n\n    def __add__(self, other):\n        return Point(self.x + other.x, self.y + other.y)",
            "class Singleton:\n    _instance = None\n\n    def __new__(cls):\n        if cls._instance is None:\n            cls._instance = super().__new__(cls)\n        return cls._instance\n\n    def __init__(self):\n        self.value = None",
            "from abc import ABC, abstractmethod\n\nclass Shape(ABC):\n    @abstractmethod\n    def area(self):\n        pass\n\nclass Circle(Shape):\n    def __init__(self, radius):\n        self.radius = radius\n\n    def area(self):\n        return 3.14159 * self.radius ** 2",
            "class Context:\n    def __init__(self, strategy):\n        self._strategy = strategy\n\n    def set_strategy(self, strategy):\n        self._strategy = strategy\n\n    def execute_strategy(self, data):\n        return self._strategy.execute(data)",

            // Python - Machine Learning snippets
            "from sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\nscaler = StandardScaler()\nX_train_scaled = scaler.fit_transform(X_train)\nX_test_scaled = scaler.transform(X_test)\nmodel = LogisticRegression()\nmodel.fit(X_train_scaled, y_train)",
            "import numpy as np\nfrom sklearn.metrics import confusion_matrix, classification_report\n\ny_pred = model.predict(X_test)\nconf_matrix = confusion_matrix(y_test, y_pred)\nprint(classification_report(y_test, y_pred))\naccuracy = np.mean(y_pred == y_test)\nprint(f'Accuracy: {accuracy:.2%}')",
            "from sklearn.ensemble import RandomForestClassifier\nfrom sklearn.model_selection import cross_val_score\n\nrf_model = RandomForestClassifier(n_estimators=100, random_state=42)\nscores = cross_val_score(rf_model, X, y, cv=5, scoring='accuracy')\nprint(f'Cross-validation scores: {scores}')\nprint(f'Mean accuracy: {scores.mean():.3f} (+/- {scores.std() * 2:.3f})')",
            "from sklearn.model_selection import GridSearchCV\n\nparam_grid = {\n    'n_estimators': [50, 100, 200],\n    'max_depth': [None, 10, 20, 30],\n    'min_samples_split': [2, 5, 10]\n}\ngrid_search = GridSearchCV(RandomForestClassifier(), param_grid, cv=5)\ngrid_search.fit(X_train, y_train)\nprint(f'Best parameters: {grid_search.best_params_}')",
            "import torch\nimport torch.nn as nn\n\nclass NeuralNet(nn.Module):\n    def __init__(self, input_size, hidden_size, num_classes):\n        super(NeuralNet, self).__init__()\n        self.fc1 = nn.Linear(input_size, hidden_size)\n        self.relu = nn.ReLU()\n        self.fc2 = nn.Linear(hidden_size, num_classes)\n\n    def forward(self, x):\n        out = self.fc1(x)\n        out = self.relu(out)\n        out = self.fc2(out)\n        return out",

            // More advanced SQL
            "CREATE TABLE users (\n    id SERIAL PRIMARY KEY,\n    email VARCHAR(255) UNIQUE NOT NULL,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n    INDEX idx_email (email),\n    INDEX idx_created_at (created_at)\n);",
            "CREATE PROCEDURE GetUserOrders(IN user_id INT)\nBEGIN\n    SELECT o.id, o.order_date, o.total,\n        (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count\n    FROM orders o\n    WHERE o.user_id = user_id\n    ORDER BY o.order_date DESC;\nEND;",
            "CREATE TRIGGER update_user_timestamp\nBEFORE UPDATE ON users\nFOR EACH ROW\nBEGIN\n    SET NEW.updated_at = CURRENT_TIMESTAMP;\nEND;",
            "CREATE VIEW active_user_summary AS\nSELECT u.id, u.email, COUNT(o.id) as order_count,\n    SUM(o.total) as total_spent,\n    MAX(o.order_date) as last_order_date\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nWHERE u.status = 'active'\nGROUP BY u.id, u.email;",
            "BEGIN TRANSACTION;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;",

            // Python - Web scraping and APIs
            "import requests\nfrom bs4 import BeautifulSoup\n\nresponse = requests.get('https://example.com')\nsoup = BeautifulSoup(response.content, 'html.parser')\ntitles = soup.find_all('h2', class_='title')\nfor title in titles:\n    print(title.text.strip())",
            "from flask import Flask, jsonify, request\n\napp = Flask(__name__)\n\n@app.route('/api/users', methods=['GET'])\ndef get_users():\n    users = User.query.all()\n    return jsonify([{'id': u.id, 'name': u.name} for u in users])\n\n@app.route('/api/users', methods=['POST'])\ndef create_user():\n    data = request.get_json()\n    user = User(name=data['name'])\n    db.session.add(user)\n    db.session.commit()\n    return jsonify({'id': user.id}), 201",
            "import asyncio\nimport aiohttp\n\nasync def fetch_url(session, url):\n    async with session.get(url) as response:\n        return await response.text()\n\nasync def main():\n    urls = ['http://example.com', 'http://example.org']\n    async with aiohttp.ClientSession() as session:\n        tasks = [fetch_url(session, url) for url in urls]\n        results = await asyncio.gather(*tasks)\n        return results",

            // Python - Data analysis
            "import pandas as pd\nimport matplotlib.pyplot as plt\n\ndf = pd.read_csv('data.csv')\ndf['date'] = pd.to_datetime(df['date'])\ndf.set_index('date', inplace=True)\nmonthly_avg = df.resample('M').mean()\nmonthly_avg.plot(figsize=(12, 6))\nplt.title('Monthly Average')\nplt.show()",
            "import seaborn as sns\nimport numpy as np\n\ncorr_matrix = df.corr()\nplt.figure(figsize=(10, 8))\nsns.heatmap(corr_matrix, annot=True, cmap='coolwarm', center=0)\nplt.title('Correlation Matrix')\nplt.show()",
            "from scipy import stats\n\ngroup1 = df[df['category'] == 'A']['value']\ngroup2 = df[df['category'] == 'B']['value']\nt_stat, p_value = stats.ttest_ind(group1, group2)\nprint(f'T-statistic: {t_stat:.4f}')\nprint(f'P-value: {p_value:.4f}')\nif p_value < 0.05:\n    print('Reject null hypothesis')"
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
let typingGameInstance = null;

function initTypingGame() {
    // Only initialize if we're on the games page and haven't initialized yet
    const gameModal = document.getElementById('typing-game-modal');
    if (gameModal && !typingGameInstance) {
        typingGameInstance = new TypingGame();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTypingGame);
} else {
    initTypingGame();
}

// Re-initialize when navigating via SPA
document.addEventListener('spa-page-loaded', (event) => {
    if (event.detail.path === '/games') {
        typingGameInstance = null; // Reset instance
        initTypingGame();
    }
});
