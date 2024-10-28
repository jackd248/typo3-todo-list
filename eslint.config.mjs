import typescript from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';

export default [
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: parser,
            parserOptions: {
                ecmaVersion: "latest",
                project: './tsconfig.json',
                parser: "@typescript-eslint/parser",
            },
        },
        plugins: {
            '@typescript-eslint': typescript,
        },
        rules: {
            ...typescript.configs.recommended.rules
        },
    }
];
