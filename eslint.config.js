import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["**/dist/", "**/node_modules/", "**/*.js"],
  },
  ...tseslint.configs.recommended,
  {
    files: ["packages/**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
    },
  },
];
