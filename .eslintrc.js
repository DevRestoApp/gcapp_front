module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    plugins: [
        "react",
        "react-hooks",
        "import",
        "@typescript-eslint",
        "prettier",
    ],
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react-hooks/recommended",
        "plugin:import/recommended",
        "plugin:import/typescript",
        "plugin:prettier/recommended",
    ],
    rules: {
        "prettier/prettier": "error",
        "react/react-in-jsx-scope": "off",
        "import/order": [
            "error",
            {
                groups: ["builtin", "external", "internal"],
                alphabetize: { order: "asc", caseInsensitive: true },
            },
        ],
    },
    settings: {
        react: {
            version: "detect",
        },
    },
};
