module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint"
  ],
  rules: {
    // "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-console": "off", // temp for debugging in docs
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    quotes: ["error", "double", { allowTemplateLiterals: true }],
    semi: ["error", "always"],
    "space-before-function-paren": ["error", "never"],
    "no-undef": "warn",
    "no-unused-vars": "warn",
    "no-unused-expressions": 0,
    "comma-dangle": ["error", "never"],
    "operator-linebreak": "off"
  },
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2020
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)"
      ],
      env: {
        jest: true
      }
    }
  ]
};
