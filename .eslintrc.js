module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "**/**/tsconfig.lint.json",
  },
  plugins: ["import", "@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:eslint-comments/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/strict",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier",
  ],
  settings: {
    "import/parsers:": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: true,
      node: true,
    },
    "import/extensions": [".js", ".ts"],
    "import/internal-regex": "^src",
  },
  rules: {
    quotes: ["error", "double"],
    "key-spacing": ["error", { afterColon: true }],
    "block-spacing": ["error"],
    "@typescript-eslint/ban-tslint-comment": ["off"],
    "space-infix-ops": ["error"],
    "no-multi-spaces": ["error", { exceptions: { ImportDeclaration: true } }],
    "keyword-spacing": ["error"],
    "arrow-spacing": ["error", { before: true, after: true }],
    "quote-props": ["error", "as-needed"],
    "object-curly-spacing": ["error", "always"],
    "brace-style": ["error", "1tbs"],
    "import/order": [
      "error",
      {
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
    "@typescript-eslint/no-inferrable-types": [
      "error",
      { ignoreParameters: true },
    ],
    "@typescript-eslint/array-type": ["error", { default: "array-simple" }],
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: false,
      },
    ],
    "import/no-extraneous-dependencies": "error",
    "import/no-mutable-exports": "error",
    "import/no-unused-modules": "error",
    "import/no-named-as-default": "off",
    "import/no-named-as-default-member": "off",
    "eslint-comments/disable-enable-pair": "off",
    "eslint-comments/no-unlimited-disable": "off",
    "no-restricted-syntax": [
      "error",
      {
        selector:
          "CallExpression[callee.object.name='console'][callee.property.name=/^(log|warn|error|info|trace)$/]",
        message:
          "Don't use console, use pino logger (or another library) instead",
      },
      {
        selector: "TSEnumDeclaration",
        message: "Don't declare enums",
      },
      {
        selector: "CallExpression[callee.property.name='save']",
        message: "Don't use typeorm save, use insert or update instead",
      },
    ],
  },
  overrides: [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
    Object.assign(require("eslint-plugin-jest").configs.recommended, {
      files: ["__tests__", "**/*.spec.ts", "**/*.spec.tsx"],
      env: {
        jest: true,
      },
      plugins: ["jest"],
      rules: {
        "jest/expect-expect": [
          "error",
          { assertFunctionNames: ["expect", "assertExpectations"] },
        ],
      },
    }),
  ],
};
