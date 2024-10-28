module.exports = {
  overrides: [
    {
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: {
          ts: '@typescript-eslint/parser',
          js: '@typescript-eslint/parser',
          project: './tsconfig.json',
          typescript: '@typescript-eslint/parser'
        }
      }
    }
  ]
};
