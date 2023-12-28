module.exports = {
  extends: 'stylelint-config-standard',
  rules: {
    'at-rule-empty-line-before': null,
    'at-rule-name-space-after': null,
    'at-rule-no-unknown': null,
    'comment-empty-line-before': null,
    'declaration-bang-space-before': null,
    'declaration-empty-line-before': null,
    'declaration-colon-newline-after': null,
    'font-family-no-missing-generic-family-keyword': null,
    'function-comma-newline-after': null,
    'function-name-case': null,
    'function-parentheses-newline-inside': null,
    'function-max-empty-lines': null,
    'function-whitespace-after': null,
    indentation: null,
    'number-leading-zero': null,
    'number-no-trailing-zeros': null,
    'rule-empty-line-before': null,
    'selector-combinator-space-after': null,
    'selector-list-comma-newline-after': null,
    'selector-pseudo-element-colon-notation': null,
    'unit-no-unknown': null,
    'value-list-max-empty-lines': null,
    'unit-case': null,
    'color-hex-case': null,
    'selector-type-no-unknown': [
      true,
      {
        ignoreTypes: ['page', 'view', 'string']
      }
    ]
  }
}
