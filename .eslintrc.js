module.exports = {
  overrides: [
    {
      files: ['**/*.vue', '**/*.js'],
      env: { browser: true },
      extends: [
        'plugin:vue/essential',
        'plugin:vue-pug-sfc/recommended',
        '@vue/prettier',
      ],
      rules: {
        curly: ['error', 'multi-line'],
        'vue/multi-word-component-names': 'off',
        'vue-pug-sfc/component-name-in-template-casing': 'off',
        'vue-pug-sfc/attribute-hyphenation': 'off',
        'vue-pug-sfc/require-v-for-key': 'off',
        'vue-pug-sfc/no-template-key': 'off',
        'no-console': 'off',
      },
    },
    {
      files: 'server/**/*.js',
      env: { node: true },
      extends: ['plugin:prettier/recommended'],
      rules: {
        'prettier/prettier': 'warn',
      },
      parser: '@babel/eslint-parser',
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
      },
    },
  ],
};
