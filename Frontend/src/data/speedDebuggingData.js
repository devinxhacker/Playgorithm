export const SPEED_DEBUGGING_LEVELS = [
  {
    id: 'syntax-sprint',
    name: 'Level 1 · Syntax Sprint',
    difficulty: 'EASY',
    badgeLabel: 'Syntax',
    timeLimit: 420,
    xpReward: 600,
    description: 'Patch missing symbols, mismatched brackets, and typo-driven crashes before the clock hits zero.',
    questions: [
      {
        id: 'syntax-1',
        title: 'Forgotten Colon',
        language: 'python',
        bugType: 'Syntax',
        prompt: 'This loop refuses to run even though the logic is fine.',
        snippet: `for i in range(5)\n    print(i)`,
        fix: `for i in range(5):\n    print(i)`,
        hint: 'Python needs punctuation after the loop header.',
        explanation:
          'Python raises “expected ":"” because every for statement must end with a colon before the indented block.'
      },
      {
        id: 'syntax-2',
        title: 'Const Trouble',
        language: 'javascript',
        bugType: 'Syntax',
        prompt: 'The code crashes with “Assignment to constant variable.” when summing a cart.',
        snippet: `const total = 0;\nfor (const price of cart) {\n  total += price;\n}\nconsole.log(total);`,
        fix: `let total = 0;\nfor (const price of cart) {\n  total += price;\n}\nconsole.log(total);`,
        hint: 'Only constants are immutable here.',
        explanation: 'Variables declared with const cannot be reassigned. Using let allows total to accumulate every price.'
      },
      {
        id: 'syntax-3',
        title: 'Return Type Missing',
        language: 'java',
        bugType: 'Syntax',
        prompt: 'The compiler cannot figure out what this method is supposed to return.',
        snippet: `public class Calculator {\n    add(int a, int b) {\n        return a + b;\n    }\n}`,
        fix: `public class Calculator {\n    public int add(int a, int b) {\n        return a + b;\n    }\n}`,
        hint: 'Java requires explicit method signatures.',
        explanation: 'Every Java method must declare its return type. Without “int” the compiler throws “missing return type”.'
      },
      {
        id: 'syntax-4',
        title: 'Indentation Panic',
        language: 'python',
        bugType: 'Syntax',
        prompt: 'Running this function throws “expected an indented block.”',
        snippet: `def greet(name):\nprint(f"Hi {name}")`,
        fix: `def greet(name):\n    print(f"Hi {name}")`,
        hint: 'Whitespace matters inside functions.',
        explanation: 'Function bodies must be indented consistently. Aligning print with the def statement violates Python rules.'
      },
      {
        id: 'syntax-5',
        title: 'Accidental Assignment',
        language: 'javascript',
        bugType: 'Logic',
        prompt: 'The condition always evaluates to true, instantly triggering the celebration.',
        snippet: `if (score = 100) {\n  celebrate();\n}`,
        fix: `if (score === 100) {\n  celebrate();\n}`,
        hint: 'Check which operator is used inside the condition.',
        explanation: 'Using = assigns 100 to score and returns 100 (truthy). === compares without mutating the value.'
      },
      {
        id: 'syntax-6',
        title: 'Missing Header',
        language: 'cpp',
        bugType: 'Syntax',
        prompt: 'Compiling this vector snippet fails with “vector was not declared in this scope.”',
        snippet: `#include <iostream>\n\nint main() {\n    vector<int> nums {1, 2, 3};\n    std::cout << nums.size();\n}`,
        fix: `#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> nums {1, 2, 3};\n    std::cout << nums.size();\n}`,
        hint: 'Standard containers live in their own header.',
        explanation: 'Without including <vector> the compiler never sees the template definition, so the identifier is unknown.'
      },
      {
        id: 'syntax-7',
        title: 'Type Mix-up',
        language: 'python',
        bugType: 'Runtime',
        prompt: 'Python raises “can only concatenate str (not "int") to str”.',
        snippet: `total = 42\nprint("Total: " + total)` ,
        fix: `total = 42\nprint(f"Total: {total}")`,
        hint: 'Mixing numbers and strings requires conversion.',
        explanation: 'Adding a str to an int is illegal. Converting the number (or using an f-string) resolves the TypeError.'
      },
      {
        id: 'syntax-8',
        title: 'Silent Arrow',
        language: 'javascript',
        bugType: 'Logic',
        prompt: 'isEven always returns undefined even for even numbers.',
        snippet: `const isEven = num => {\n  num % 2 === 0;\n};`,
        fix: `const isEven = num => {\n  return num % 2 === 0;\n};`,
        hint: 'Arrow blocks need explicit returns unless you remove the braces.',
        explanation: 'Blocks with braces require an explicit return; otherwise undefined is returned every time.'
      },
      {
        id: 'syntax-9',
        title: 'Semicolon Slip',
        language: 'java',
        bugType: 'Syntax',
        prompt: 'Compilation stops with “; expected”.',
        snippet: `int lives = 3\nSystem.out.println(lives);`,
        fix: `int lives = 3;\nSystem.out.println(lives);`,
        hint: 'Look at the end of the first line.',
        explanation: 'Java statements must end with a semicolon. The compiler halts before it even reads the println.'
      },
      {
        id: 'syntax-10',
        title: 'Dangling Brace',
        language: 'python',
        bugType: 'Syntax',
        prompt: 'Loading this config raises “unexpected EOF while parsing”.',
        snippet: `config = {\n    "host": "localhost",\n    "port": 5432\n`,
        fix: `config = {\n    "host": "localhost",\n    "port": 5432\n}`,
        hint: 'Count the opening and closing braces.',
        explanation: 'The dictionary never closes, so Python hits the end of file still expecting a “}”.'
      }
    ]
  },
  {
    id: 'logic-lab',
    name: 'Level 2 · Logic Lab',
    difficulty: 'MEDIUM',
    badgeLabel: 'Logic',
    timeLimit: 540,
    xpReward: 900,
    description: 'Chase fence-post errors, incorrect conditions, and sneaky state bugs across multiple languages.',
    questions: [
      {
        id: 'logic-1',
        title: 'Factorial Base Case',
        language: 'python',
        bugType: 'Logic',
        prompt: 'factorial(0) triggers maximum recursion depth.',
        snippet: `def factorial(n):\n    if n == 1:\n        return 1\n    return n * factorial(n - 1)`,
        fix: `def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)`,
        hint: 'How should factorial(0) behave?',
        explanation: 'Factorial of 0 is 1. Expanding the base case prevents infinite recursion on zero and negative inputs.'
      },
      {
        id: 'logic-2',
        title: 'Average Off-by-One',
        language: 'javascript',
        bugType: 'Logic',
        prompt: 'The average skews high because the divisor is too small.',
        snippet: `function average(numbers) {\n  const total = numbers.reduce((sum, value) => sum + value, 0);\n  return total / (numbers.length - 1);\n}`,
        fix: `function average(numbers) {\n  const total = numbers.reduce((sum, value) => sum + value, 0);\n  return total / numbers.length;\n}`,
        hint: 'How many items are you averaging?',
        explanation: 'Averaging requires dividing by the count of elements. Subtracting one inflates every result.'
      },
      {
        id: 'logic-3',
        title: 'Loop Boundary Crash',
        language: 'java',
        bugType: 'Runtime',
        prompt: 'ArrayIndexOutOfBoundsException appears on the last iteration.',
        snippet: `for (int i = 0; i <= values.length; i++) {\n    if (values[i] == target) {\n        return true;\n    }\n}\nreturn false;`,
        fix: `for (int i = 0; i < values.length; i++) {\n    if (values[i] == target) {\n        return true;\n    }\n}\nreturn false;`,
        hint: 'Remember arrays are zero-indexed.',
        explanation: 'Using <= attempts to read values[values.length], which is one past the end of the array.'
      },
      {
        id: 'logic-4',
        title: 'Negative Max Bug',
        language: 'python',
        bugType: 'Logic',
        prompt: 'max_value stays 0 even when all numbers are negative.',
        snippet: `def find_max(nums):\n    max_value = 0\n    for num in nums:\n        if num > max_value:\n            max_value = num\n    return max_value`,
        fix: `def find_max(nums):\n    max_value = nums[0]\n    for num in nums:\n        if num > max_value:\n            max_value = num\n    return max_value`,
        hint: 'What if every number is below zero?',
        explanation: 'Seeding the maximum with 0 assumes positive inputs. Using the first element adapts to any sign.'
      },
      {
        id: 'logic-5',
        title: 'Wrong Parity Filter',
        language: 'javascript',
        bugType: 'Logic',
        prompt: 'The function returns odd numbers even though “even” is in the name.',
        snippet: `const keepEven = nums => nums.filter(n => n % 2);`,
        fix: `const keepEven = nums => nums.filter(n => n % 2 === 0);`,
        hint: 'filter keeps items whose callback returns truthy.',
        explanation: 'n % 2 returns 0 for even numbers, which filter treats as false. Comparing to zero flips the logic.'
      },
      {
        id: 'logic-6',
        title: 'Chunk Drop',
        language: 'python',
        bugType: 'Logic',
        prompt: 'The last few items never appear in the result when the list size is not divisible by chunk size.',
        snippet: `def chunk(items, size):\n    slices = []\n    for i in range(0, len(items) - size, size):\n        slices.append(items[i:i + size])\n    return slices`,
        fix: `def chunk(items, size):\n    slices = []\n    for i in range(0, len(items), size):\n        slices.append(items[i:i + size])\n    return slices`,
        hint: 'range stop value is exclusive.',
        explanation: 'Stopping at len - size skips any remainder chunk; iterating to len ensures the final partial slice is captured.'
      },
      {
        id: 'logic-7',
        title: 'Binary Search Freeze',
        language: 'python',
        bugType: 'Logic',
        prompt: 'The loop can become infinite when the target is larger than every element.',
        snippet: `while left <= right:\n    mid = (left + right) // 2\n    if nums[mid] == target:\n        return mid\n    if nums[mid] < target:\n        left = mid\n    else:\n        right = mid - 1`,
        fix: `while left <= right:\n    mid = (left + right) // 2\n    if nums[mid] == target:\n        return mid\n    if nums[mid] < target:\n        left = mid + 1\n    else:\n        right = mid - 1`,
        hint: 'Do you remove the element you just inspected?',
        explanation: 'Setting left = mid keeps the same bounds when target is larger, so the loop never terminates.'
      },
      {
        id: 'logic-8',
        title: 'Inclusive Range',
        language: 'javascript',
        bugType: 'Logic',
        prompt: 'sumRange(1, 3) returns 3 instead of 6.',
        snippet: `function sumRange(start, end) {\n  let total = 0;\n  for (let i = start; i < end; i++) {\n    total += i;\n  }\n  return total;\n}`,
        fix: `function sumRange(start, end) {\n  let total = 0;\n  for (let i = start; i <= end; i++) {\n    total += i;\n  }\n  return total;\n}`,
        hint: 'Should the end value be counted?',
        explanation: 'The loop stops before processing end. Making the condition <= includes the upper bound.'
      },
      {
        id: 'logic-9',
        title: 'Flatten Confusion',
        language: 'python',
        bugType: 'Logic',
        prompt: 'The result duplicates lists instead of items.',
        snippet: `def flatten(list_of_lists):\n    return [item for sublist in list_of_lists for item in list_of_lists]`,
        fix: `def flatten(list_of_lists):\n    return [item for sublist in list_of_lists for item in sublist]`,
        hint: 'Double-check the innermost iterable.',
        explanation: 'The comprehension iterates list_of_lists twice, emitting entire sublists repeatedly. Use sublist to access the nested items.'
      },
      {
        id: 'logic-10',
        title: 'Accumulator Reset',
        language: 'javascript',
        bugType: 'Logic',
        prompt: 'calculateStreak always returns 1 because the counter resets prematurely.',
        snippet: `function calculateStreak(events) {\n  let streak = 0;\n  for (const event of events) {\n    if (event.success) {\n      streak = 1;\n    } else {\n      streak = 0;\n    }\n  }\n  return streak;\n}`,
        fix: `function calculateStreak(events) {\n  let streak = 0;\n  for (const event of events) {\n    if (event.success) {\n      streak += 1;\n    } else {\n      streak = 0;\n    }\n  }\n  return streak;\n}`,
        hint: 'Growing counters should add, not reset.',
        explanation: 'Assigning 1 discards previous wins. Incrementing preserves the streak length.'
      }
    ]
  },
  {
    id: 'runtime-rumble',
    name: 'Level 3 · Runtime Rumble',
    difficulty: 'HARD',
    badgeLabel: 'Runtime',
    timeLimit: 660,
    xpReward: 1200,
    description: 'Stabilize async flows, shared state, and sneaky performance killers under intense time pressure.',
    questions: [
      {
        id: 'runtime-1',
        title: 'Mutable Default Trap',
        language: 'python',
        bugType: 'Runtime',
        prompt: 'Cached results leak between separate calls of the function.',
        snippet: `def remember(key, value, cache={}):\n    cache[key] = value\n    return cache`,
        fix: `def remember(key, value, cache=None):\n    cache = {} if cache is None else cache\n    cache[key] = value\n    return cache`,
        hint: 'Mutable defaults live for the entire module lifetime.',
        explanation: 'The same dictionary instance is reused across calls. Guarding with None ensures each call can start fresh.'
      },
      {
        id: 'runtime-2',
        title: 'Missing Await',
        language: 'javascript',
        bugType: 'Runtime',
        prompt: 'The function returns before all network requests finish.',
        snippet: `async function fetchAll(ids) {\n  ids.map(async id => {\n    return await api.fetchById(id);\n  });\n}`,
        fix: `async function fetchAll(ids) {\n  return Promise.all(ids.map(id => api.fetchById(id)));\n}`,
        hint: 'map alone does not await the inner async callback.',
        explanation: 'The async callbacks execute but nothing awaits them. Promise.all ensures the caller waits for completion.'
      },
      {
        id: 'runtime-3',
        title: 'Local Reference Escape',
        language: 'cpp',
        bugType: 'Runtime',
        prompt: 'The caller reads garbage because a reference outlives the variable.',
        snippet: `const string& makeUser() {\n    std::string name = "kai";\n    return name;\n}`,
        fix: `std::string makeUser() {\n    std::string name = "kai";\n    return name;\n}`,
        hint: 'Never return references to stack variables.',
        explanation: 'name is destroyed when the function exits. Returning by value copies the data safely.'
      },
      {
        id: 'runtime-4',
        title: 'Un-awaited gather',
        language: 'python',
        bugType: 'Runtime',
        prompt: 'Coroutines run but the event loop never waits for them.',
        snippet: `async def warm_cache(keys):\n    tasks = [fetch(key) for key in keys]\n    asyncio.gather(*tasks)`,
        fix: `async def warm_cache(keys):\n    tasks = [fetch(key) for key in keys]\n    await asyncio.gather(*tasks)`,
        hint: 'Coroutines need an await to run to completion.',
        explanation: 'Without await the gather coroutine is created but never executed, so work never finishes.'
      },
      {
        id: 'runtime-5',
        title: 'Promise Chain Leak',
        language: 'javascript',
        bugType: 'Runtime',
        prompt: 'Errors skip the catch block because the promise is never returned.',
        snippet: `function saveUser(user) {\n  db.connect().then(conn => {\n    conn.insert(user);\n  }).catch(handleFail);\n}`,
        fix: `function saveUser(user) {\n  return db.connect()\n    .then(conn => {\n      conn.insert(user);\n    })\n    .catch(handleFail);\n}`,
        hint: 'Without returning, the caller sees an unresolved promise.',
        explanation: 'Missing return detaches the promise, so upstream callers cannot await or catch failures.'
      },
      {
        id: 'runtime-6',
        title: 'Thread Safety',
        language: 'python',
        bugType: 'Runtime',
        prompt: 'Two threads increment the same counter but the final value is random.',
        snippet: `counter = 0\n\ndef increment():\n    global counter\n    for _ in range(1000):\n        counter += 1`,
        fix: `import threading\n\ncounter = 0\nlock = threading.Lock()\n\ndef increment():\n    global counter\n    for _ in range(1000):\n        with lock:\n            counter += 1`,
        hint: 'Increments are not atomic in CPython.',
        explanation: 'Two threads can read, increment, and store simultaneously. A lock ensures only one thread mutates the counter at a time.'
      },
      {
        id: 'runtime-7',
        title: 'Executor Never Ends',
        language: 'java',
        bugType: 'Runtime',
        prompt: 'The program hangs because the thread pool never terminates.',
        snippet: `ExecutorService pool = Executors.newFixedThreadPool(4);\npool.submit(task);\n// program exits here`,
        fix: `ExecutorService pool = Executors.newFixedThreadPool(4);\npool.submit(task);\npool.shutdown();\n// program exits here`,
        hint: 'Threads keep JVM alive until shut down.',
        explanation: 'Executor threads are non-daemon by default. Shutting down signals them to finish so the JVM can exit.'
      },
      {
        id: 'runtime-8',
        title: 'Closure Capture',
        language: 'javascript',
        bugType: 'Runtime',
        prompt: 'All timers log 5 even though the loop iterates 5 times.',
        snippet: `for (var i = 0; i < 5; i++) {\n  setTimeout(() => console.log(i), 0);\n}`,
        fix: `for (let i = 0; i < 5; i++) {\n  setTimeout(() => console.log(i), 0);\n}`,
        hint: 'var is function-scoped.',
        explanation: 'var shares one binding across the loop, so callbacks read the final value. let creates a new binding per iteration.'
      },
      {
        id: 'runtime-9',
        title: 'Optional Misuse',
        language: 'java',
        bugType: 'Runtime',
        prompt: 'A NoSuchElementException bubbles up when the optional is empty.',
        snippet: `Optional<User> user = repo.find(username);\nreturn user.get();`,
        fix: `Optional<User> user = repo.find(username);\nreturn user.orElseThrow(() -> new NotFound());`,
        hint: 'get() assumes a value exists.',
        explanation: 'Calling get() on an empty Optional throws immediately. Guarding or using orElse handles the absence gracefully.'
      },
      {
        id: 'runtime-10',
        title: 'Event Listener Leak',
        language: 'javascript',
        bugType: 'Runtime',
        prompt: 'Every modal open adds another identical event handler, causing duplicate submissions.',
        snippet: `function openModal() {\n  document.addEventListener('submit', handleSubmit);\n  modal.classList.add('is-open');\n}`,
        fix: `function openModal() {\n  document.addEventListener('submit', handleSubmit, { once: true });\n  modal.classList.add('is-open');\n}`,
        hint: 'Repeated registrations stack up.',
        explanation: 'Attaching the same listener each time duplicates work. Register once or remove it on close to prevent leaks.'
      }
    ]
  }
];
