/**
 * rules
 * https://eslint.org/docs/rules/
 * https://github.com/benmosher/eslint-plugin-import
 */
 module.exports = {
  extends: ['standard', 'prettier'],
  env: {
    node: true,
    commonjs: true,
    es6: true
  },
  globals: {
    App: true,
    getApp: true,
    Page: true,
    wx: true,
    getCurrentPages: true,
    Component: true,
    Behavior: true,

    getDate: true,
    getRegExp: true
  },
  plugins: ['import', 'prettier'],

  /**
   * "off"    0
   * "warn"   1
   * "error"  2
   */
  rules: {
    // 'prettier/prettier': 'error',

    'space-before-function-paren': [0],
    eqeqeq: [0],
    'vars-on-top': [2],
    'no-var': [2],
    'object-property-newline': [1],
    'object-shorthand': [
      'error',
      'always',
      {
        ignoreConstructors: false,
        avoidQuotes: true
      }
    ],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var']
      },
      {
        blankLine: 'always',
        prev: ['import', 'cjs-import'],
        next: 'expression'
      },
      { blankLine: 'always', prev: '*', next: 'block-like' },
      { blankLine: 'always', prev: 'block-like', next: '*' },
      { blankLine: 'always', prev: '*', next: 'return' }
    ],
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true
        },
        AssignmentExpression: {
          array: false,
          object: true
        }
      },
      {
        enforceForRenamedProperties: false
      }
    ],
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'prefer-arrow-callback': [
      'error',
      {
        allowNamedFunctions: false,
        allowUnboundThis: true
      }
    ],
    'no-use-before-define': [
      'error',
      {
        classes: true,
        functions: false,
        variables: true
      }
    ],
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true
      }
    ]
  }
}
