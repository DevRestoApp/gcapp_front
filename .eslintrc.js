module.exports = {
    root: true,
    extends: [
        "expo",
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    plugins: ["@typescript-eslint", "react", "react-hooks"],
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    ignorePatterns: [
        "node_modules/",
        ".expo/",
        "dist/",
        "build/",
        "*.config.js",
        ".eslintrc.js",
    ],
    rules: {
        "import/no-unresolved": "off",
        "@typescript-eslint/no-unused-vars": [
            "warn",
            { argsIgnorePattern: "^_" },
        ],
        "@typescript-eslint/no-explicit-any": "warn",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
    },
};
