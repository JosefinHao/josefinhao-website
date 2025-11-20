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
            },

            // More O(1) examples
            {
                code: 'def swap(a, b):\n    temp = a\n    a = b\n    b = temp\n    return a, b',
                complexityType: 'time',
                options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
                correct: 0,
                explanation: 'Swapping two variables involves a fixed number of operations regardless of input size, making it O(1).'
            },
            {
                code: 'def check_even(n):\n    return n % 2 == 0',
                complexityType: 'time',
                options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
                correct: 0,
                explanation: 'Modulo and comparison are both constant time operations. The function runs in O(1) time.'
            },
            {
                code: 'def get_middle(arr):\n    return arr[len(arr) // 2]',
                complexityType: 'time',
                options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
                correct: 0,
                explanation: 'len() is O(1) for lists, and array indexing is O(1). Total time complexity is O(1).'
            },
            {
                code: 'def push_to_stack(stack, item):\n    stack.append(item)',
                complexityType: 'time',
                options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
                correct: 0,
                explanation: 'Appending to a list (amortized) takes constant time O(1).'
            },

            // More O(n) examples
            {
                code: 'def reverse_array(arr):\n    return arr[::-1]',
                complexityType: 'time',
                options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
                correct: 1,
                explanation: 'Reversing requires visiting each element once to create the reversed array, resulting in O(n) time.'
            },
            {
                code: 'def contains(arr, target):\n    for item in arr:\n        if item == target:\n            return True\n    return False',
                complexityType: 'time',
                options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
                correct: 1,
                explanation: 'Linear search may need to check every element in worst case, giving O(n) time complexity.'
            },
            {
                code: 'def count_positives(arr):\n    count = 0\n    for num in arr:\n        if num > 0:\n            count += 1\n    return count',
                complexityType: 'time',
                options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
                correct: 1,
                explanation: 'The function iterates through the array once, checking each element. Time complexity is O(n).'
            },
            {
                code: 'def find_min_max(arr):\n    return min(arr), max(arr)',
                complexityType: 'time',
                options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
                correct: 1,
                explanation: 'Both min() and max() must examine every element, each taking O(n). Total is O(n) + O(n) = O(n).'
            },
            {
                code: 'def copy_array(arr):\n    new_arr = []\n    for item in arr:\n        new_arr.append(item)\n    return new_arr',
                complexityType: 'time',
                options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
                correct: 1,
                explanation: 'Copying requires iterating through each element once, resulting in O(n) time complexity.'
            },

            // More O(log n) examples
            {
                code: 'def find_insert_position(arr, target):\n    left, right = 0, len(arr)\n    while left < right:\n        mid = (left + right) // 2\n        if arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid\n    return left',
                complexityType: 'time',
                options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
                correct: 2,
                explanation: 'Binary search variant that finds insertion position by halving search space each iteration: O(log n).'
            },
            {
                code: 'def count_bits(n):\n    count = 0\n    while n > 0:\n        count += 1\n        n //= 2\n    return count',
                complexityType: 'time',
                options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
                correct: 2,
                explanation: 'Dividing n by 2 repeatedly takes log₂(n) iterations to reach 0, giving O(log n) complexity.'
            },
            {
                code: 'def search_rotated(arr, target):\n    # Binary search on rotated sorted array\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        if arr[left] <= arr[mid]:\n            if arr[left] <= target < arr[mid]:\n                right = mid - 1\n            else:\n                left = mid + 1\n        else:\n            if arr[mid] < target <= arr[right]:\n                left = mid + 1\n            else:\n                right = mid - 1\n    return -1',
                complexityType: 'time',
                options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(n²)'],
                correct: 1,
                explanation: 'Modified binary search on rotated array still halves search space each time: O(log n).'
            },

            // More O(n²) examples
            {
                code: 'def selection_sort(arr):\n    for i in range(len(arr)):\n        min_idx = i\n        for j in range(i + 1, len(arr)):\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n        arr[i], arr[min_idx] = arr[min_idx], arr[i]\n    return arr',
                complexityType: 'time',
                options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(n²)'],
                correct: 3,
                explanation: 'Selection sort uses nested loops: outer loop runs n times, inner loop averages n/2, giving O(n²).'
            },
            {
                code: 'def insertion_sort(arr):\n    for i in range(1, len(arr)):\n        key = arr[i]\n        j = i - 1\n        while j >= 0 and arr[j] > key:\n            arr[j + 1] = arr[j]\n            j -= 1\n        arr[j + 1] = key\n    return arr',
                complexityType: 'time',
                options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(n²)'],
                correct: 3,
                explanation: 'Insertion sort worst case: each of n elements may need to be compared with all previous elements, O(n²).'
            },
            {
                code: 'def find_all_pairs(arr):\n    pairs = []\n    for i in range(len(arr)):\n        for j in range(i + 1, len(arr)):\n            pairs.append((arr[i], arr[j]))\n    return pairs',
                complexityType: 'time',
                options: ['O(n)', 'O(n²)', 'O(log n)', 'O(n³)'],
                correct: 1,
                explanation: 'Generating all pairs requires nested loops checking each element with every other: O(n²).'
            },
            {
                code: 'def is_unique(s):\n    for i in range(len(s)):\n        for j in range(i + 1, len(s)):\n            if s[i] == s[j]:\n                return False\n    return True',
                complexityType: 'time',
                options: ['O(n)', 'O(n²)', 'O(log n)', 'O(n log n)'],
                correct: 1,
                explanation: 'Comparing each character with all others requires nested loops: O(n²).'
            },

            // O(n log n) examples
            {
                code: 'def heap_sort(arr):\n    # Build max heap and extract elements\n    import heapq\n    heapq.heapify(arr)\n    return [heapq.heappop(arr) for _ in range(len(arr))]',
                complexityType: 'time',
                options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(n²)'],
                correct: 1,
                explanation: 'Heap sort builds heap in O(n), then extracts n elements with O(log n) each: O(n log n) total.'
            },
            {
                code: 'def merge_k_sorted_lists(lists):\n    import heapq\n    heap = []\n    for lst in lists:\n        for item in lst:\n            heapq.heappush(heap, item)\n    return [heapq.heappop(heap) for _ in range(len(heap))]',
                complexityType: 'time',
                options: ['O(n)', 'O(n log k)', 'O(n log n)', 'O(k log n)'],
                correct: 2,
                explanation: 'Inserting n total elements into heap with n log n operations, then extracting: O(n log n).'
            },
            {
                code: 'def closest_pair_sort(points):\n    points.sort()\n    min_dist = float("inf")\n    for i in range(len(points) - 1):\n        dist = points[i+1] - points[i]\n        min_dist = min(min_dist, dist)\n    return min_dist',
                complexityType: 'time',
                options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(n²)'],
                correct: 1,
                explanation: 'Sorting dominates: O(n log n). The linear scan after is O(n), so total is O(n log n).'
            },

            // O(2^n) - Exponential examples
            {
                code: 'def fibonacci_naive(n):\n    if n <= 1:\n        return n\n    return fibonacci_naive(n-1) + fibonacci_naive(n-2)',
                complexityType: 'time',
                options: ['O(n)', 'O(n²)', 'O(2^n)', 'O(log n)'],
                correct: 2,
                explanation: 'Without memoization, each call spawns 2 more calls, creating a binary tree of depth n: O(2^n).'
            },
            {
                code: 'def generate_subsets(arr):\n    if not arr:\n        return [[]]\n    subsets = generate_subsets(arr[1:])\n    return subsets + [[arr[0]] + s for s in subsets]',
                complexityType: 'time',
                options: ['O(n)', 'O(2^n)', 'O(n²)', 'O(n!)'],
                correct: 1,
                explanation: 'Generating all subsets creates 2^n subsets (each element is in or out), time complexity O(2^n).'
            },
            {
                code: 'def tower_of_hanoi(n):\n    if n == 1:\n        return 1\n    return 2 * tower_of_hanoi(n-1) + 1',
                complexityType: 'time',
                options: ['O(n)', 'O(2^n)', 'O(n²)', 'O(log n)'],
                correct: 1,
                explanation: 'Tower of Hanoi recurrence T(n) = 2T(n-1) + 1 solves to O(2^n) moves.'
            },

            // O(n!) - Factorial examples
            {
                code: 'def generate_permutations(arr):\n    if len(arr) <= 1:\n        return [arr]\n    perms = []\n    for i in range(len(arr)):\n        rest = arr[:i] + arr[i+1:]\n        for p in generate_permutations(rest):\n            perms.append([arr[i]] + p)\n    return perms',
                complexityType: 'time',
                options: ['O(n²)', 'O(2^n)', 'O(n!)', 'O(n³)'],
                correct: 2,
                explanation: 'Generating all permutations creates n! permutations, each requiring O(n) work: O(n! * n).'
            },
            {
                code: 'def traveling_salesman_brute(cities):\n    # Try all possible routes\n    from itertools import permutations\n    min_dist = float("inf")\n    for route in permutations(cities):\n        dist = calculate_distance(route)\n        min_dist = min(min_dist, dist)\n    return min_dist',
                complexityType: 'time',
                options: ['O(n²)', 'O(2^n)', 'O(n!)', 'O(n³)'],
                correct: 2,
                explanation: 'Brute force TSP checks all n! permutations of cities: O(n!).'
            },

            // O(n³) - Cubic examples
            {
                code: 'def matrix_multiply(A, B):\n    n = len(A)\n    C = [[0] * n for _ in range(n)]\n    for i in range(n):\n        for j in range(n):\n            for k in range(n):\n                C[i][j] += A[i][k] * B[k][j]\n    return C',
                complexityType: 'time',
                options: ['O(n²)', 'O(n³)', 'O(n log n)', 'O(n!)'],
                correct: 1,
                explanation: 'Three nested loops each running n times results in O(n³) for matrix multiplication.'
            },
            {
                code: 'def floyd_warshall(graph):\n    n = len(graph)\n    dist = [[float("inf")] * n for _ in range(n)]\n    for k in range(n):\n        for i in range(n):\n            for j in range(n):\n                dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])\n    return dist',
                complexityType: 'time',
                options: ['O(n²)', 'O(n³)', 'O(n log n)', 'O(n⁴)'],
                correct: 1,
                explanation: 'Floyd-Warshall uses three nested loops over all vertices: O(n³).'
            },
            {
                code: 'def find_triplet_sum(arr, target):\n    for i in range(len(arr)):\n        for j in range(i + 1, len(arr)):\n            for k in range(j + 1, len(arr)):\n                if arr[i] + arr[j] + arr[k] == target:\n                    return (i, j, k)\n    return None',
                complexityType: 'time',
                options: ['O(n²)', 'O(n³)', 'O(n log n)', 'O(n!)'],
                correct: 1,
                explanation: 'Three nested loops to check all triplets: O(n³).'
            },

            // More space complexity examples
            {
                code: 'def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)',
                complexityType: 'space',
                options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
                correct: 2,
                explanation: 'Merge sort creates temporary arrays at each level. Total extra space used is O(n).'
            },
            {
                code: 'def quick_sort_in_place(arr, low, high):\n    if low < high:\n        pi = partition(arr, low, high)\n        quick_sort_in_place(arr, low, pi - 1)\n        quick_sort_in_place(arr, pi + 1, high)',
                complexityType: 'space',
                options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
                correct: 1,
                explanation: 'In-place quicksort uses O(log n) space for recursion stack in average case.'
            },
            {
                code: 'def binary_search_iterative(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1',
                complexityType: 'space',
                options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
                correct: 0,
                explanation: 'Iterative binary search uses only a few variables, constant O(1) space.'
            },
            {
                code: 'def generate_matrix(n):\n    matrix = [[0] * n for _ in range(n)]\n    return matrix',
                complexityType: 'space',
                options: ['O(1)', 'O(n)', 'O(n²)', 'O(n³)'],
                correct: 2,
                explanation: 'Creating an n×n matrix requires n² space: O(n²).'
            },
            {
                code: 'def flatten_nested_list(nested):\n    result = []\n    def helper(lst):\n        for item in lst:\n            if isinstance(item, list):\n                helper(item)\n            else:\n                result.append(item)\n    helper(nested)\n    return result',
                complexityType: 'space',
                options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
                correct: 1,
                explanation: 'Result list stores all n elements. Recursion depth depends on nesting, but output is O(n).'
            },

            // More algorithm examples
            {
                code: 'def sieve_of_eratosthenes(n):\n    primes = [True] * (n + 1)\n    p = 2\n    while p * p <= n:\n        if primes[p]:\n            for i in range(p * p, n + 1, p):\n                primes[i] = False\n        p += 1\n    return [p for p in range(2, n + 1) if primes[p]]',
                complexityType: 'time',
                options: ['O(n)', 'O(n log n)', 'O(n log log n)', 'O(n²)'],
                correct: 2,
                explanation: 'Sieve of Eratosthenes has time complexity O(n log log n) due to marking multiples.'
            },
            {
                code: 'def kadane_max_subarray(arr):\n    max_sum = float("-inf")\n    current_sum = 0\n    for num in arr:\n        current_sum = max(num, current_sum + num)\n        max_sum = max(max_sum, current_sum)\n    return max_sum',
                complexityType: 'time',
                options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'],
                correct: 1,
                explanation: 'Kadane\'s algorithm scans array once: O(n) time complexity.'
            },
            {
                code: 'def kmp_search(text, pattern):\n    # KMP pattern matching with preprocessing\n    lps = compute_lps(pattern)\n    i = j = 0\n    while i < len(text):\n        if pattern[j] == text[i]:\n            i += 1\n            j += 1\n        if j == len(pattern):\n            return i - j\n        elif i < len(text) and pattern[j] != text[i]:\n            if j != 0:\n                j = lps[j - 1]\n            else:\n                i += 1\n    return -1',
                complexityType: 'time',
                options: ['O(n + m)', 'O(n * m)', 'O(n²)', 'O(m log n)'],
                correct: 0,
                explanation: 'KMP preprocessing is O(m), searching is O(n), total O(n + m) where n=text length, m=pattern length.'
            },
            {
                code: 'def edit_distance(s1, s2):\n    m, n = len(s1), len(s2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(m + 1):\n        for j in range(n + 1):\n            if i == 0:\n                dp[i][j] = j\n            elif j == 0:\n                dp[i][j] = i\n            elif s1[i-1] == s2[j-1]:\n                dp[i][j] = dp[i-1][j-1]\n            else:\n                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])\n    return dp[m][n]',
                complexityType: 'time',
                options: ['O(m + n)', 'O(m * n)', 'O(m² * n²)', 'O(m log n)'],
                correct: 1,
                explanation: 'Edit distance DP fills m×n table: O(m * n) time complexity.'
            },
            {
                code: 'def longest_increasing_subsequence(arr):\n    n = len(arr)\n    dp = [1] * n\n    for i in range(1, n):\n        for j in range(i):\n            if arr[i] > arr[j]:\n                dp[i] = max(dp[i], dp[j] + 1)\n    return max(dp)',
                complexityType: 'time',
                options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2^n)'],
                correct: 2,
                explanation: 'Basic LIS DP uses nested loops: outer n times, inner averages n/2, giving O(n²).'
            },
            {
                code: 'def bfs(graph, start):\n    from collections import deque\n    visited = set()\n    queue = deque([start])\n    visited.add(start)\n    while queue:\n        node = queue.popleft()\n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)',
                complexityType: 'time',
                options: ['O(V)', 'O(E)', 'O(V + E)', 'O(V * E)'],
                correct: 2,
                explanation: 'BFS visits all V vertices and explores all E edges once: O(V + E).'
            },
            {
                code: 'def dfs(graph, node, visited=None):\n    if visited is None:\n        visited = set()\n    visited.add(node)\n    for neighbor in graph[node]:\n        if neighbor not in visited:\n            dfs(graph, neighbor, visited)\n    return visited',
                complexityType: 'time',
                options: ['O(V)', 'O(E)', 'O(V + E)', 'O(V * E)'],
                correct: 2,
                explanation: 'DFS visits all V vertices and explores all E edges once: O(V + E).'
            },
            {
                code: 'def dijkstra(graph, start):\n    import heapq\n    dist = {node: float("inf") for node in graph}\n    dist[start] = 0\n    pq = [(0, start)]\n    while pq:\n        d, node = heapq.heappop(pq)\n        if d > dist[node]:\n            continue\n        for neighbor, weight in graph[node]:\n            new_dist = dist[node] + weight\n            if new_dist < dist[neighbor]:\n                dist[neighbor] = new_dist\n                heapq.heappush(pq, (new_dist, neighbor))\n    return dist',
                complexityType: 'time',
                options: ['O(V)', 'O(E log V)', 'O(V²)', 'O(E²)'],
                correct: 1,
                explanation: 'Dijkstra with min-heap: each of E edges may add to heap with log V operation: O((V + E) log V) ≈ O(E log V).'
            },
            {
                code: 'def bellman_ford(graph, start):\n    dist = {node: float("inf") for node in graph}\n    dist[start] = 0\n    for _ in range(len(graph) - 1):\n        for node in graph:\n            for neighbor, weight in graph[node]:\n                if dist[node] + weight < dist[neighbor]:\n                    dist[neighbor] = dist[node] + weight\n    return dist',
                complexityType: 'time',
                options: ['O(V)', 'O(V * E)', 'O(E log V)', 'O(V²)'],
                correct: 1,
                explanation: 'Bellman-Ford relaxes all E edges V-1 times: O(V * E).'
            },
            {
                code: 'def topological_sort(graph):\n    from collections import deque\n    in_degree = {node: 0 for node in graph}\n    for node in graph:\n        for neighbor in graph[node]:\n            in_degree[neighbor] += 1\n    queue = deque([node for node in graph if in_degree[node] == 0])\n    result = []\n    while queue:\n        node = queue.popleft()\n        result.append(node)\n        for neighbor in graph[node]:\n            in_degree[neighbor] -= 1\n            if in_degree[neighbor] == 0:\n                queue.append(neighbor)\n    return result',
                complexityType: 'time',
                options: ['O(V)', 'O(E)', 'O(V + E)', 'O(V * E)'],
                correct: 2,
                explanation: 'Kahn\'s algorithm visits all V vertices and processes all E edges: O(V + E).'
            },
            {
                code: 'def longest_common_subsequence(s1, s2):\n    m, n = len(s1), len(s2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if s1[i-1] == s2[j-1]:\n                dp[i][j] = dp[i-1][j-1] + 1\n            else:\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    return dp[m][n]',
                complexityType: 'time',
                options: ['O(m + n)', 'O(m * n)', 'O(m² + n²)', 'O(max(m, n))'],
                correct: 1,
                explanation: 'LCS DP fills m×n table with constant work per cell: O(m * n).'
            },
            {
                code: 'def knapsack_01(weights, values, capacity):\n    n = len(weights)\n    dp = [[0] * (capacity + 1) for _ in range(n + 1)]\n    for i in range(1, n + 1):\n        for w in range(capacity + 1):\n            if weights[i-1] <= w:\n                dp[i][w] = max(dp[i-1][w], dp[i-1][w-weights[i-1]] + values[i-1])\n            else:\n                dp[i][w] = dp[i-1][w]\n    return dp[n][capacity]',
                complexityType: 'time',
                options: ['O(n)', 'O(n * W)', 'O(2^n)', 'O(n²)'],
                correct: 1,
                explanation: '0/1 Knapsack DP fills n×W table: O(n * W) where W is capacity.'
            },
            {
                code: 'def rabin_karp(text, pattern):\n    # Rolling hash string matching\n    d = 256\n    q = 101\n    m, n = len(pattern), len(text)\n    p = t = 0\n    h = pow(d, m-1, q)\n    for i in range(m):\n        p = (d * p + ord(pattern[i])) % q\n        t = (d * t + ord(text[i])) % q\n    for i in range(n - m + 1):\n        if p == t:\n            if text[i:i+m] == pattern:\n                return i\n        if i < n - m:\n            t = (d * (t - ord(text[i]) * h) + ord(text[i+m])) % q\n    return -1',
                complexityType: 'time',
                options: ['O(n + m)', 'O(n * m)', 'O(n)', 'O(m log n)'],
                correct: 0,
                explanation: 'Rabin-Karp with good hash: O(n + m) average case (preprocessing pattern + scanning text).'
            },
            {
                code: 'def union_find_with_path_compression(parent, x):\n    if parent[x] != x:\n        parent[x] = union_find_with_path_compression(parent, parent[x])\n    return parent[x]',
                complexityType: 'time',
                options: ['O(1)', 'O(log n)', 'O(α(n))', 'O(n)'],
                correct: 2,
                explanation: 'Union-Find with path compression has amortized O(α(n)) per operation, where α is inverse Ackermann (nearly constant).'
            },
            {
                code: 'def counting_sort(arr, max_val):\n    count = [0] * (max_val + 1)\n    for num in arr:\n        count[num] += 1\n    output = []\n    for i, c in enumerate(count):\n        output.extend([i] * c)\n    return output',
                complexityType: 'time',
                options: ['O(n)', 'O(n + k)', 'O(n log n)', 'O(n²)'],
                correct: 1,
                explanation: 'Counting sort iterates through n elements and k possible values: O(n + k).'
            },
            {
                code: 'def radix_sort(arr):\n    max_num = max(arr)\n    exp = 1\n    while max_num // exp > 0:\n        counting_sort_by_digit(arr, exp)\n        exp *= 10\n    return arr',
                complexityType: 'time',
                options: ['O(n)', 'O(d * (n + k))', 'O(n log n)', 'O(n²)'],
                correct: 1,
                explanation: 'Radix sort performs d counting sorts (d=digits), each O(n+k): O(d * (n + k)).'
            },
            {
                code: 'def bucket_sort(arr):\n    n = len(arr)\n    buckets = [[] for _ in range(n)]\n    for num in arr:\n        idx = int(num * n)\n        buckets[idx].append(num)\n    for bucket in buckets:\n        bucket.sort()\n    return [num for bucket in buckets for num in bucket]',
                complexityType: 'time',
                options: ['O(n)', 'O(n + k)', 'O(n²)', 'O(n log n)'],
                correct: 1,
                explanation: 'Bucket sort with uniform distribution: O(n + k) average case, where k is number of buckets.'
            },
            {
                code: 'def strassen_matrix_mult(A, B):\n    # Strassen\'s matrix multiplication\n    # Divide matrices, compute 7 products recursively\n    n = len(A)\n    if n == 1:\n        return [[A[0][0] * B[0][0]]]\n    # ... recursive calls ...\n    return result',
                complexityType: 'time',
                options: ['O(n²)', 'O(n^2.807)', 'O(n³)', 'O(n log n)'],
                correct: 1,
                explanation: 'Strassen\'s algorithm reduces matrix multiplication to approximately O(n^2.807) using divide-and-conquer.'
            },
            {
                code: 'def boyer_moore_majority(arr):\n    count = 0\n    candidate = None\n    for num in arr:\n        if count == 0:\n            candidate = num\n        count += (1 if num == candidate else -1)\n    return candidate',
                complexityType: 'time',
                options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
                correct: 1,
                explanation: 'Boyer-Moore majority vote algorithm scans array once: O(n) time, O(1) space.'
            },
            {
                code: 'def manacher_palindrome(s):\n    # Find longest palindromic substring\n    T = "#" + "#".join(s) + "#"\n    n = len(T)\n    P = [0] * n\n    C = R = 0\n    for i in range(n):\n        if i < R:\n            P[i] = min(R - i, P[2*C - i])\n        while i + P[i] + 1 < n and i - P[i] - 1 >= 0 and T[i + P[i] + 1] == T[i - P[i] - 1]:\n            P[i] += 1\n        if i + P[i] > R:\n            C, R = i, i + P[i]\n    return max(P)',
                complexityType: 'time',
                options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(n³)'],
                correct: 0,
                explanation: 'Manacher\'s algorithm finds longest palindrome in linear time O(n) using clever center expansion.'
            },
            {
                code: 'def z_algorithm(s):\n    n = len(s)\n    Z = [0] * n\n    l, r = 0, 0\n    for i in range(1, n):\n        if i > r:\n            l, r = i, i\n            while r < n and s[r] == s[r-l]:\n                r += 1\n            Z[i] = r - l\n            r -= 1\n        else:\n            k = i - l\n            if Z[k] < r - i + 1:\n                Z[i] = Z[k]\n            else:\n                l = i\n                while r < n and s[r] == s[r-l]:\n                    r += 1\n                Z[i] = r - l\n                r -= 1\n    return Z',
                complexityType: 'time',
                options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(n * m)'],
                correct: 0,
                explanation: 'Z-algorithm computes Z-array for pattern matching in linear O(n) time.'
            },
            {
                code: 'def suffix_array_naive(s):\n    suffixes = [(s[i:], i) for i in range(len(s))]\n    suffixes.sort()\n    return [idx for _, idx in suffixes]',
                complexityType: 'time',
                options: ['O(n)', 'O(n log n)', 'O(n² log n)', 'O(n³)'],
                correct: 2,
                explanation: 'Naive suffix array: n suffixes, each O(n) to compare, sorted in O(n² log n).'
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
let bigoGameInstance = null;

function initBigoGame() {
    // Only initialize if we're on the games page and haven't initialized yet
    const gameElement = document.getElementById('bigo-code-display');
    if (gameElement && !bigoGameInstance) {
        bigoGameInstance = new BigOGame();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBigoGame);
} else {
    initBigoGame();
}

// Re-initialize when navigating via SPA
document.addEventListener('spa-page-loaded', (event) => {
    if (event.detail.path === '/games') {
        bigoGameInstance = null; // Reset instance
        initBigoGame();
    }
});
