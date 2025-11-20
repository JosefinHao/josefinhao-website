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
            },

            // More Python - Easy
            {
                difficulty: 'easy',
                language: 'Python',
                code: 'x = 10\ny = x\nx = 5\nprint(y)',
                options: ['5', '10', '15', 'Error'],
                correct: 1,
                explanation: 'y is assigned the value 10 (not a reference for integers). When x changes to 5, y remains 10 because integers are immutable.'
            },
            {
                difficulty: 'easy',
                language: 'Python',
                code: 'print(3 * "abc")',
                options: ['abcabcabc', '3abc', 'abc3', 'Error'],
                correct: 0,
                explanation: 'String multiplication repeats the string. "abc" * 3 results in "abcabcabc".'
            },
            {
                difficulty: 'easy',
                language: 'Python',
                code: 'x = [1, 2, 3]\nprint(x[len(x)-1])',
                options: ['1', '2', '3', 'Error'],
                correct: 2,
                explanation: 'len(x) is 3, so len(x)-1 is 2, which accesses the element at index 2, which is 3.'
            },
            {
                difficulty: 'easy',
                language: 'Python',
                code: 'x = True\ny = False\nprint(x or y)',
                options: ['True', 'False', '1', '0'],
                correct: 0,
                explanation: 'The OR operator returns True if at least one operand is True. Since x is True, the result is True.'
            },
            {
                difficulty: 'easy',
                language: 'Python',
                code: 'x = [1, 2, 3, 4]\nprint(x[-2])',
                options: ['2', '3', '4', 'Error'],
                correct: 1,
                explanation: 'Negative indexing starts from the end. -1 is the last element (4), -2 is second to last (3).'
            },
            {
                difficulty: 'easy',
                language: 'Python',
                code: 'print(len("Hello\\nWorld"))',
                options: ['10', '11', '12', '5'],
                correct: 1,
                explanation: '\\n is a single newline character. The string has 5 + 1 + 5 = 11 characters total.'
            },
            {
                difficulty: 'easy',
                language: 'Python',
                code: 'x = {1, 2, 3}\nprint(type(x))',
                options: ["<class 'dict'>", "<class 'set'>", "<class 'list'>", "<class 'tuple'>"],
                correct: 1,
                explanation: 'Curly braces with values (not key-value pairs) create a set. This is a set containing {1, 2, 3}.'
            },
            {
                difficulty: 'easy',
                language: 'Python',
                code: 'x = 7\nprint(x % 3)',
                options: ['1', '2', '3', '0'],
                correct: 0,
                explanation: 'The modulo operator % returns the remainder. 7 divided by 3 is 2 remainder 1, so the result is 1.'
            },
            {
                difficulty: 'easy',
                language: 'Python',
                code: 'print(bool([]))',
                options: ['True', 'False', '[]', 'Error'],
                correct: 1,
                explanation: 'An empty list evaluates to False in a boolean context. bool([]) returns False.'
            },
            {
                difficulty: 'easy',
                language: 'Python',
                code: 'x = "hello"\nprint(x.upper()[:3])',
                options: ['HEL', 'hel', 'HELLO', 'hello'],
                correct: 0,
                explanation: 'x.upper() converts to "HELLO", then [:3] slices the first 3 characters, resulting in "HEL".'
            },

            // More Python - Medium
            {
                difficulty: 'medium',
                language: 'Python',
                code: 'x = [1, 2, 3]\ny = x.copy()\ny.append(4)\nprint(len(x))',
                options: ['3', '4', '7', 'Error'],
                correct: 0,
                explanation: 'The copy() method creates a shallow copy. Changes to y do not affect x, so x still has 3 elements.'
            },
            {
                difficulty: 'medium',
                language: 'Python',
                code: 'print(all([True, 1, "yes"]))',
                options: ['True', 'False', '1', 'Error'],
                correct: 0,
                explanation: 'all() returns True if all elements are truthy. True, 1, and "yes" are all truthy, so the result is True.'
            },
            {
                difficulty: 'medium',
                language: 'Python',
                code: 'x = {1, 2, 3}\ny = {2, 3, 4}\nprint(x | y)',
                options: ['{1, 2, 3, 4}', '{2, 3}', '{1, 4}', 'Error'],
                correct: 0,
                explanation: 'The | operator performs set union, combining all unique elements from both sets: {1, 2, 3, 4}.'
            },
            {
                difficulty: 'medium',
                language: 'Python',
                code: 'd = {"a": 1}\nprint(d.setdefault("b", 2))\nprint(len(d))',
                options: ['2\\n1', '2\\n2', 'None\\n1', 'None\\n2'],
                correct: 1,
                explanation: 'setdefault() returns the value if key exists, otherwise sets and returns the default. It returns 2 and adds "b":2 to dict, making length 2.'
            },
            {
                difficulty: 'medium',
                language: 'Python',
                code: 'x = [1, 2, 3, 4, 5]\nprint(x[1:4])',
                options: ['[1, 2, 3]', '[2, 3, 4]', '[2, 3, 4, 5]', '[1, 2, 3, 4]'],
                correct: 1,
                explanation: 'Slice [1:4] includes index 1, 2, 3 but excludes 4. So it returns [2, 3, 4].'
            },
            {
                difficulty: 'medium',
                language: 'Python',
                code: 'x = "hello world"\nprint(x.split()[1])',
                options: ['hello', 'world', 'hello world', 'Error'],
                correct: 1,
                explanation: 'split() without arguments splits by whitespace, returning ["hello", "world"]. Index [1] gives "world".'
            },
            {
                difficulty: 'medium',
                language: 'Python',
                code: 'print(sum([1, 2, 3], 10))',
                options: ['6', '16', '10', 'Error'],
                correct: 1,
                explanation: 'sum() takes an optional start value as second argument. It adds all elements starting from 10: 10+1+2+3 = 16.'
            },
            {
                difficulty: 'medium',
                language: 'Python',
                code: 'x = [1, 2, 2, 3, 3, 3]\nprint(len(set(x)))',
                options: ['3', '6', '9', 'Error'],
                correct: 0,
                explanation: 'set(x) creates a set with unique values {1, 2, 3}. The length of this set is 3.'
            },
            {
                difficulty: 'medium',
                language: 'Python',
                code: 'print({x: x**2 for x in range(3)})',
                options: ['{0: 0, 1: 1, 2: 4}', '[0, 1, 4]', '{0, 1, 4}', 'Error'],
                correct: 0,
                explanation: 'Dictionary comprehension creates a dict with keys 0,1,2 mapped to their squares: {0: 0, 1: 1, 2: 4}.'
            },
            {
                difficulty: 'medium',
                language: 'Python',
                code: 'x = [1, 2, 3]\nprint(x.pop())\nprint(len(x))',
                options: ['3\\n2', '3\\n3', '1\\n2', 'Error'],
                correct: 0,
                explanation: 'pop() removes and returns the last element. It returns 3, leaving x with 2 elements.'
            },

            // More Python - Hard
            {
                difficulty: 'hard',
                language: 'Python',
                code: 'x = [1, 2, 3]\nprint(x * 2)',
                options: ['[2, 4, 6]', '[1, 2, 3, 1, 2, 3]', '[1, 2, 3, 2]', 'Error'],
                correct: 1,
                explanation: 'List multiplication repeats the entire list. [1,2,3] * 2 creates [1, 2, 3, 1, 2, 3].'
            },
            {
                difficulty: 'hard',
                language: 'Python',
                code: 'print(0.1 + 0.2 == 0.3)',
                options: ['True', 'False', '0.3', 'Error'],
                correct: 1,
                explanation: 'Floating point arithmetic has precision issues. 0.1 + 0.2 gives 0.30000000000000004, which is not exactly 0.3, so False.'
            },
            {
                difficulty: 'hard',
                language: 'Python',
                code: 'x = [1, 2, 3]\ny = x[:]\ny[0] = 99\nprint(x[0])',
                options: ['1', '99', '[1, 2, 3]', 'Error'],
                correct: 0,
                explanation: 'x[:] creates a shallow copy of the list. Modifying y doesn\'t affect x, so x[0] remains 1.'
            },
            {
                difficulty: 'hard',
                language: 'Python',
                code: 'print("a" in "abc" and "d" not in "abc")',
                options: ['True', 'False', 'a', 'Error'],
                correct: 0,
                explanation: '"a" is in "abc" (True) AND "d" is not in "abc" (True), so True AND True gives True.'
            },
            {
                difficulty: 'hard',
                language: 'Python',
                code: 'x = {1: "a", 2: "b"}\nprint(x.get(3, "c"))',
                options: ['None', '"c"', 'c', 'Error'],
                correct: 2,
                explanation: 'get() with default value returns the default when key doesn\'t exist. Since 3 is not in dict, it returns "c" (displayed as c).'
            },
            {
                difficulty: 'hard',
                language: 'Python',
                code: 'x = [[], []]\nx[0].append(1)\nprint(len(x[1]))',
                options: ['0', '1', '2', 'Error'],
                correct: 0,
                explanation: 'Each inner list is a separate object. Appending to x[0] doesn\'t affect x[1], which remains empty with length 0.'
            },
            {
                difficulty: 'hard',
                language: 'Python',
                code: 'print(list(zip([1,2], [3,4,5])))',
                options: ['[(1, 3), (2, 4)]', '[(1, 3), (2, 4), (None, 5)]', '[(1, 3), (2, 4), 5]', 'Error'],
                correct: 0,
                explanation: 'zip() pairs elements from multiple iterables. It stops at the shortest iterable, so only 2 pairs: [(1, 3), (2, 4)].'
            },
            {
                difficulty: 'hard',
                language: 'Python',
                code: 'x = [1, 2, 3, 4, 5]\nprint(x[::2])',
                options: ['[1, 2, 3]', '[1, 3, 5]', '[2, 4]', '[1, 2, 3, 4, 5]'],
                correct: 1,
                explanation: 'Slice with step 2 (::2) takes every second element starting from index 0: [1, 3, 5].'
            },
            {
                difficulty: 'hard',
                language: 'Python',
                code: 'print(int("101", 2))',
                options: ['101', '5', '3', 'Error'],
                correct: 1,
                explanation: 'int() with base 2 converts binary to decimal. Binary "101" is 1*4 + 0*2 + 1*1 = 5.'
            },
            {
                difficulty: 'hard',
                language: 'Python',
                code: 'x = [1, 2, 3]\nprint(3 in x and 4 not in x)',
                options: ['True', 'False', '3', 'Error'],
                correct: 0,
                explanation: '3 is in the list (True) AND 4 is not in the list (True), so True AND True gives True.'
            },

            // JavaScript - Easy
            {
                difficulty: 'easy',
                language: 'JavaScript',
                code: 'let x = "5";\nlet y = 3;\nconsole.log(x + y);',
                options: ['"53"', '8', '53', 'Error'],
                correct: 0,
                explanation: 'The + operator performs string concatenation when one operand is a string. "5" + 3 results in "53".'
            },
            {
                difficulty: 'easy',
                language: 'JavaScript',
                code: 'console.log(typeof null);',
                options: ['"null"', '"object"', '"undefined"', '"number"'],
                correct: 1,
                explanation: 'This is a well-known JavaScript quirk. typeof null returns "object" due to a historical bug in JavaScript.'
            },
            {
                difficulty: 'easy',
                language: 'JavaScript',
                code: 'let arr = [1, 2, 3];\nconsole.log(arr.length);',
                options: ['2', '3', '4', 'undefined'],
                correct: 1,
                explanation: 'The length property returns the number of elements in the array, which is 3.'
            },
            {
                difficulty: 'easy',
                language: 'JavaScript',
                code: 'console.log(10 === "10");',
                options: ['true', 'false', '1', '0'],
                correct: 1,
                explanation: 'The === operator checks both value and type. 10 (number) is not the same type as "10" (string), so false.'
            },
            {
                difficulty: 'easy',
                language: 'JavaScript',
                code: 'let x = true;\nconsole.log(!x);',
                options: ['true', 'false', '0', '1'],
                correct: 1,
                explanation: 'The ! operator is logical NOT. !true returns false.'
            },

            // JavaScript - Medium
            {
                difficulty: 'medium',
                language: 'JavaScript',
                code: 'let arr = [1, 2, 3, 4, 5];\nconsole.log(arr.slice(1, 3));',
                options: ['[1, 2]', '[2, 3]', '[2, 3, 4]', '[1, 2, 3]'],
                correct: 1,
                explanation: 'slice(1, 3) extracts elements from index 1 (inclusive) to 3 (exclusive), returning [2, 3].'
            },
            {
                difficulty: 'medium',
                language: 'JavaScript',
                code: 'let x = [1, 2, 3];\nlet y = x;\ny.push(4);\nconsole.log(x.length);',
                options: ['3', '4', '7', 'undefined'],
                correct: 1,
                explanation: 'Arrays are passed by reference. y and x point to the same array, so pushing to y affects x. Length is 4.'
            },
            {
                difficulty: 'medium',
                language: 'JavaScript',
                code: 'console.log([1, 2, 3].map(x => x * 2));',
                options: ['[1, 2, 3]', '[2, 4, 6]', '[3, 6, 9]', 'Error'],
                correct: 1,
                explanation: 'map() applies the function to each element. Multiplying each by 2 gives [2, 4, 6].'
            },
            {
                difficulty: 'medium',
                language: 'JavaScript',
                code: 'let obj = {a: 1, b: 2};\nconsole.log(Object.keys(obj).length);',
                options: ['1', '2', '3', 'undefined'],
                correct: 1,
                explanation: 'Object.keys() returns an array of the object\'s keys ["a", "b"]. The length is 2.'
            },
            {
                difficulty: 'medium',
                language: 'JavaScript',
                code: 'console.log([1, 2, 3].reduce((a, b) => a + b, 0));',
                options: ['0', '3', '6', '123'],
                correct: 2,
                explanation: 'reduce() sums all elements starting from 0: 0+1+2+3 = 6.'
            },

            // JavaScript - Hard
            {
                difficulty: 'hard',
                language: 'JavaScript',
                code: 'console.log(0.1 + 0.2 === 0.3);',
                options: ['true', 'false', '0.3', 'NaN'],
                correct: 1,
                explanation: 'Due to floating-point precision, 0.1 + 0.2 equals 0.30000000000000004, not exactly 0.3, so false.'
            },
            {
                difficulty: 'hard',
                language: 'JavaScript',
                code: 'let arr = [1, 2, 3];\narr[10] = 10;\nconsole.log(arr.length);',
                options: ['4', '10', '11', '3'],
                correct: 2,
                explanation: 'Setting arr[10] creates empty slots. Array length becomes 11 (indices 0-10, even though most are empty).'
            },
            {
                difficulty: 'hard',
                language: 'JavaScript',
                code: 'console.log([1, 2, 3] == [1, 2, 3]);',
                options: ['true', 'false', '[1, 2, 3]', 'Error'],
                correct: 1,
                explanation: 'Arrays are objects and compared by reference, not value. These are two different array objects, so false.'
            },
            {
                difficulty: 'hard',
                language: 'JavaScript',
                code: 'let x = {a: 1};\nlet y = x;\ny.a = 2;\nconsole.log(x.a);',
                options: ['1', '2', 'undefined', 'Error'],
                correct: 1,
                explanation: 'Objects are passed by reference. x and y point to the same object, so modifying y.a also changes x.a to 2.'
            },
            {
                difficulty: 'hard',
                language: 'JavaScript',
                code: 'console.log("" || "hello");',
                options: ['""', '"hello"', 'hello', 'true'],
                correct: 2,
                explanation: 'The || operator returns the first truthy value. "" is falsy, so it returns "hello" (displayed without quotes).'
            },

            // More SQL - Easy
            {
                difficulty: 'easy',
                language: 'SQL',
                code: 'SELECT AVG(age) FROM users;\n-- ages: [20, 30, 40, 50]',
                options: ['30', '35', '40', '25'],
                correct: 1,
                explanation: 'AVG() calculates the mean: (20+30+40+50)/4 = 140/4 = 35.'
            },
            {
                difficulty: 'easy',
                language: 'SQL',
                code: 'SELECT name FROM users WHERE age >= 18 AND age <= 25;\n-- Returns users between 18-25',
                options: ['Only age 18', 'Only age 25', 'Ages 18-25 inclusive', 'Ages 19-24'],
                correct: 2,
                explanation: '>= and <= are inclusive operators. This selects users with age from 18 to 25, including both endpoints.'
            },
            {
                difficulty: 'easy',
                language: 'SQL',
                code: 'SELECT UPPER(name) FROM users WHERE id = 1;\n-- name is "alice"',
                options: ['alice', 'Alice', 'ALICE', 'aLICE'],
                correct: 2,
                explanation: 'UPPER() converts all characters to uppercase. "alice" becomes "ALICE".'
            },
            {
                difficulty: 'easy',
                language: 'SQL',
                code: 'SELECT COUNT(*) FROM products WHERE price IS NULL;',
                options: ['0', 'NULL', 'Count of NULL prices', 'Error'],
                correct: 2,
                explanation: 'IS NULL checks for NULL values. COUNT(*) returns the number of rows where price is NULL.'
            },
            {
                difficulty: 'easy',
                language: 'SQL',
                code: 'SELECT SUM(quantity) FROM orders;\n-- quantities: [10, 20, NULL, 30]',
                options: ['60', 'NULL', '40', '50'],
                correct: 0,
                explanation: 'SUM() ignores NULL values. It adds 10+20+30 = 60.'
            },

            // More SQL - Medium
            {
                difficulty: 'medium',
                language: 'SQL',
                code: 'SELECT category, AVG(price) as avg_price\nFROM products\nGROUP BY category\nHAVING AVG(price) > 100;',
                options: ['All categories', 'Categories with total > 100', 'Categories with avg price > 100', 'Error'],
                correct: 2,
                explanation: 'HAVING filters grouped results. This returns only categories where the average price exceeds 100.'
            },
            {
                difficulty: 'medium',
                language: 'SQL',
                code: 'SELECT name FROM users\nWHERE email LIKE "%@gmail.com";',
                options: ['All users', 'Users with Gmail', 'Users without Gmail', 'First user'],
                correct: 1,
                explanation: 'LIKE with % wildcard matches patterns. %@gmail.com matches any email ending with @gmail.com.'
            },
            {
                difficulty: 'medium',
                language: 'SQL',
                code: 'SELECT user_id, COUNT(*) FROM orders\nGROUP BY user_id;',
                options: ['Total orders', 'Order count per user', 'User count', 'First order'],
                correct: 1,
                explanation: 'GROUP BY user_id groups orders by each user. COUNT(*) gives the number of orders for each user.'
            },
            {
                difficulty: 'medium',
                language: 'SQL',
                code: 'SELECT * FROM products\nWHERE price BETWEEN 50 AND 100;',
                options: ['Price < 50', 'Price 50-100 inclusive', 'Price > 100', 'Price 51-99'],
                correct: 1,
                explanation: 'BETWEEN is inclusive on both ends. This selects products with price from 50 to 100, including both.'
            },
            {
                difficulty: 'medium',
                language: 'SQL',
                code: 'SELECT name, price * 1.1 as new_price FROM products;',
                options: ['Original prices', 'Prices increased by 10%', 'Prices decreased', 'Error'],
                correct: 1,
                explanation: 'Multiplying price by 1.1 increases it by 10%. For example, $100 becomes $110.'
            },

            // More SQL - Hard
            {
                difficulty: 'hard',
                language: 'SQL',
                code: 'SELECT u.name\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nWHERE o.id IS NULL;',
                options: ['All users', 'Users with orders', 'Users without orders', 'All orders'],
                correct: 2,
                explanation: 'LEFT JOIN includes all users. WHERE o.id IS NULL filters for users with no matching orders, i.e., users without orders.'
            },
            {
                difficulty: 'hard',
                language: 'SQL',
                code: 'SELECT name FROM products\nWHERE id IN (SELECT product_id FROM orders WHERE amount > 1000);',
                options: ['All products', 'Products in large orders', 'Expensive products', 'First product'],
                correct: 1,
                explanation: 'The subquery finds product_ids from orders over $1000. IN selects products with those ids - products that appear in large orders.'
            },
            {
                difficulty: 'hard',
                language: 'SQL',
                code: 'SELECT COALESCE(price, 0) FROM products WHERE id = 1;\n-- price is NULL',
                options: ['NULL', '0', '1', 'Error'],
                correct: 1,
                explanation: 'COALESCE returns the first non-NULL value. Since price is NULL, it returns the default value 0.'
            },
            {
                difficulty: 'hard',
                language: 'SQL',
                code: 'SELECT name, RANK() OVER (ORDER BY salary DESC) FROM employees;',
                options: ['Names only', 'Names with salaries', 'Names with rank by salary', 'Error'],
                correct: 2,
                explanation: 'RANK() is a window function that assigns ranks based on ORDER BY. This ranks employees by salary (highest first).'
            },
            {
                difficulty: 'hard',
                language: 'SQL',
                code: 'SELECT COUNT(*) FROM\n(SELECT DISTINCT user_id FROM orders) as unique_users;',
                options: ['Total orders', 'Unique user count', 'Average orders', 'Total users'],
                correct: 1,
                explanation: 'The subquery finds distinct user_ids from orders. COUNT(*) on this result gives the number of unique users who placed orders.'
            },

            // More tricky Python questions
            {
                difficulty: 'hard',
                language: 'Python',
                code: 'x = [1, 2]\ny = [x, x]\ny[0][0] = 99\nprint(y[1][0])',
                options: ['1', '99', '[99, 2]', 'Error'],
                correct: 1,
                explanation: 'Both y[0] and y[1] reference the same list x. Modifying y[0][0] changes x, so y[1][0] is also 99.'
            },
            {
                difficulty: 'hard',
                language: 'Python',
                code: 'print([] or [1] or [2])',
                options: ['[]', '[1]', '[2]', 'True'],
                correct: 1,
                explanation: 'or returns the first truthy value. [] is falsy, [1] is truthy, so it returns [1] without evaluating [2].'
            },
            {
                difficulty: 'hard',
                language: 'Python',
                code: 'x = "123"\nprint(x.zfill(5))',
                options: ['"123"', '"12300"', '"00123"', '"123  "'],
                correct: 2,
                explanation: 'zfill() pads a string with zeros on the left to reach the specified width. "123".zfill(5) gives "00123".'
            },
            {
                difficulty: 'hard',
                language: 'Python',
                code: 'x = [1, 2, 3, 4, 5]\nprint(x[1:4:2])',
                options: ['[1, 3]', '[2, 4]', '[2, 3]', '[1, 2, 3, 4]'],
                correct: 1,
                explanation: 'Slice with step: [start:stop:step]. [1:4:2] starts at index 1, stops before 4, step 2: [2, 4].'
            },
            {
                difficulty: 'hard',
                language: 'Python',
                code: 'x = {1, 2, 3}\ny = {3, 4, 5}\nprint(x - y)',
                options: ['{1, 2}', '{4, 5}', '{-2, -3}', 'Error'],
                correct: 0,
                explanation: 'Set difference (-) returns elements in x but not in y. {1, 2, 3} - {3, 4, 5} = {1, 2}.'
            },
            {
                difficulty: 'medium',
                language: 'Python',
                code: 'x = "hello"\nprint(x.replace("l", "L", 1))',
                options: ['"heLLo"', '"heLlo"', '"helLo"', '"HELLO"'],
                correct: 1,
                explanation: 'replace() with count 1 replaces only the first occurrence. Only the first "l" becomes "L": "heLlo".'
            },
            {
                difficulty: 'medium',
                language: 'Python',
                code: 'x = [3, 1, 4, 1, 5]\nprint(sorted(x)[:3])',
                options: ['[1, 1, 3]', '[3, 1, 4]', '[5, 4, 3]', '[1, 3, 4]'],
                correct: 0,
                explanation: 'sorted(x) returns [1, 1, 3, 4, 5]. Slicing [:3] gives the first 3 elements: [1, 1, 3].'
            },
            {
                difficulty: 'medium',
                language: 'Python',
                code: 'x = {"a": 1, "b": 2}\ny = {"b": 3, "c": 4}\nx.update(y)\nprint(len(x))',
                options: ['2', '3', '4', '5'],
                correct: 1,
                explanation: 'update() merges dictionaries. Existing keys are overwritten. x becomes {"a": 1, "b": 3, "c": 4}, length 3.'
            },
            {
                difficulty: 'medium',
                language: 'Python',
                code: 'print(any([False, 0, "", None, "x"]))',
                options: ['True', 'False', '"x"', 'None'],
                correct: 0,
                explanation: 'any() returns True if at least one element is truthy. "x" is truthy, so the result is True.'
            },
            {
                difficulty: 'hard',
                language: 'Python',
                code: 'x = [1, 2, 3]\nprint(*x)',
                options: ['[1, 2, 3]', '1 2 3', '6', 'Error'],
                correct: 1,
                explanation: 'The * operator unpacks the list. print(*x) is equivalent to print(1, 2, 3), outputting "1 2 3".'
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
let guessGameInstance = null;

function initGuessGame() {
    // Only initialize if we're on the games page and haven't initialized yet
    const gameElement = document.getElementById('guess-code-display');
    if (gameElement && !guessGameInstance) {
        guessGameInstance = new GuessOutputGame();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGuessGame);
} else {
    initGuessGame();
}

// Re-initialize when navigating via SPA
document.addEventListener('spa-page-loaded', (event) => {
    if (event.detail.path === '/games') {
        guessGameInstance = null; // Reset instance
        initGuessGame();
    }
});
