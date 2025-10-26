package com.super30.Playgorithm.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class LanguageTemplateService {

    public Map<String, String> getDefaultStarterCodeTemplates(String problemType) {
        Map<String, String> templates = new HashMap<>();

        // C++ Templates
        templates.put("cpp", getCppTemplate(problemType));
        templates.put("cpp17", getCpp17Template(problemType));
        templates.put("cpp20", getCpp20Template(problemType));

        // Java Template
        templates.put("java", getJavaTemplate(problemType));

        // Python Templates
        templates.put("python", getPythonTemplate(problemType));
        templates.put("python3", getPython3Template(problemType));

        // JavaScript Template
        templates.put("javascript", getJavaScriptTemplate(problemType));

        // C Template
        templates.put("c", getCTemplate(problemType));

        return templates;
    }

    private String getCppTemplate(String problemType) {
        return """
                #include <iostream>
                #include <vector>
                #include <algorithm>
                #include <string>
                #include <map>
                #include <set>
                #include <queue>
                #include <stack>
                using namespace std;

                int main() {
                    ios_base::sync_with_stdio(false);
                    cin.tie(NULL);

                    // Your code here

                    return 0;
                }
                """;
    }

    private String getCpp17Template(String problemType) {
        return """
                #include <iostream>
                #include <vector>
                #include <algorithm>
                #include <string>
                #include <map>
                #include <set>
                #include <queue>
                #include <stack>
                #include <optional>
                #include <string_view>
                using namespace std;

                int main() {
                    ios_base::sync_with_stdio(false);
                    cin.tie(NULL);

                    // Your C++17 code here
                    // You can use features like structured bindings, if constexpr, etc.

                    return 0;
                }
                """;
    }

    private String getCpp20Template(String problemType) {
        return """
                #include <iostream>
                #include <vector>
                #include <algorithm>
                #include <string>
                #include <map>
                #include <set>
                #include <queue>
                #include <stack>
                #include <optional>
                #include <string_view>
                #include <ranges>
                #include <concepts>
                using namespace std;

                int main() {
                    ios_base::sync_with_stdio(false);
                    cin.tie(NULL);

                    // Your C++20 code here
                    // You can use ranges, concepts, coroutines, etc.

                    return 0;
                }
                """;
    }

    private String getJavaTemplate(String problemType) {
        return """
                import java.util.*;
                import java.io.*;

                public class Solution {
                    public static void main(String[] args) {
                        Scanner scanner = new Scanner(System.in);

                        // Your Java code here

                        scanner.close();
                    }
                }
                """;
    }

    private String getPythonTemplate(String problemType) {
        return """
                # Python 2.7 template
                import sys

                def main():
                    # Your Python code here
                    pass

                if __name__ == "__main__":
                    main()
                """;
    }

    private String getPython3Template(String problemType) {
        return """
                # Python 3.x template
                import sys
                from typing import List, Dict, Set, Tuple, Optional

                def main():
                    # Your Python 3 code here
                    pass

                if __name__ == "__main__":
                    main()
                """;
    }

    private String getJavaScriptTemplate(String problemType) {
        return """
                // JavaScript (Node.js) template
                const readline = require('readline');

                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout
                });

                function main() {
                    // Your JavaScript code here
                }

                rl.on('line', (input) => {
                    // Process input
                    main();
                });
                """;
    }

    private String getCTemplate(String problemType) {
        return """
                #include <stdio.h>
                #include <stdlib.h>
                #include <string.h>
                #include <math.h>

                int main() {
                    // Your C code here

                    return 0;
                }
                """;
    }

    public Map<String, String> getLanguageConfigurations() {
        Map<String, String> configs = new HashMap<>();

        configs.put("cpp",
                "{\"version\": \"g++ 9.4.0\", \"extension\": \".cpp\", \"compile\": \"g++ -o solution solution.cpp\", \"run\": \"./solution\", \"timeout\": 5, \"memory\": 256}");
        configs.put("cpp17",
                "{\"version\": \"g++ 9.4.0\", \"extension\": \".cpp\", \"compile\": \"g++ -std=c++17 -o solution solution.cpp\", \"run\": \"./solution\", \"timeout\": 5, \"memory\": 256}");
        configs.put("cpp20",
                "{\"version\": \"g++ 10.3.0\", \"extension\": \".cpp\", \"compile\": \"g++ -std=c++20 -o solution solution.cpp\", \"run\": \"./solution\", \"timeout\": 5, \"memory\": 256}");
        configs.put("java",
                "{\"version\": \"OpenJDK 11\", \"extension\": \".java\", \"compile\": \"javac Solution.java\", \"run\": \"java Solution\", \"timeout\": 10, \"memory\": 512}");
        configs.put("python",
                "{\"version\": \"Python 2.7\", \"extension\": \".py\", \"compile\": \"\", \"run\": \"python solution.py\", \"timeout\": 10, \"memory\": 256}");
        configs.put("python3",
                "{\"version\": \"Python 3.9\", \"extension\": \".py\", \"compile\": \"\", \"run\": \"python3 solution.py\", \"timeout\": 10, \"memory\": 256}");
        configs.put("javascript",
                "{\"version\": \"Node.js 16\", \"extension\": \".js\", \"compile\": \"\", \"run\": \"node solution.js\", \"timeout\": 10, \"memory\": 256}");
        configs.put("c",
                "{\"version\": \"gcc 9.4.0\", \"extension\": \".c\", \"compile\": \"gcc -o solution solution.c\", \"run\": \"./solution\", \"timeout\": 5, \"memory\": 256}");

        return configs;
    }

    public String getStarterCodeForLanguage(String language, String problemType) {
        Map<String, String> templates = getDefaultStarterCodeTemplates(problemType);
        return templates.getOrDefault(language.toLowerCase(), templates.get("cpp"));
    }

    public boolean isLanguageSupported(String language) {
        return getDefaultStarterCodeTemplates("default").containsKey(language.toLowerCase());
    }
}