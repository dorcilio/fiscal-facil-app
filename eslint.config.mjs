import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import pluginVue from 'eslint-plugin-vue'
import prettierSkipFormatting from '@vue/eslint-config-prettier/skip-formatting'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  ...compat.extends(
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'prettier'
  ),
  // Upgrade to strongly-recommended for better code quality
  ...pluginVue.configs['flat/strongly-recommended'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },

    rules: {
      'no-console': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'vue/require-default-prop': 'off',
      // Vue 3 specific rules
      'vue/component-api-style': ['error', ['script-setup', 'composition']],
      'vue/component-name-in-template-casing': ['error', 'kebab-case'],
      'vue/custom-event-name-casing': ['error', 'kebab-case'],
      'vue/define-macros-order': [
        'error',
        {
          order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots'],
        },
      ],
      'vue/no-required-prop-with-default': 'error',
      'vue/no-unused-refs': 'error',
      'vue/prefer-separate-static-class': 'error',
      'vue/prefer-true-attribute-shorthand': 'error',
      'vue/block-order': [
        'error',
        {
          order: ['template', 'script', 'style'],
        },
      ],
    },
  },
  prettierSkipFormatting,
]
