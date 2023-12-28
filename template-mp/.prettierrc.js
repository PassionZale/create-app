module.exports = {
  overrides: [
    {
      files: '*.wxss',
      options: {
        parser: 'css'
      }
    },
    {
      files: '*.wxs',
      options: {
        parser: 'babel'
      }
    }
  ],

  /**
   * 保留现有的结尾行
   */
  endOfLine: 'auto',

  /**
   * 代码行的长度
   */
  printWidth: 80,

  /**
   * 缩进方式
   * true  = tab缩进
   * false = 空格缩进
   */
  useTabs: false,

  /**
   * 缩进长度
   */
  tabWidth: 2,

  /**
   * 语句是否有";"
   *
   * true  - const a = 1;
   * false - const b = 2
   */
  semi: false,

  /**
   * 字符串是否使用单引号包裹
   *
   * true  - 'hello'
   * false - "a"
   */
  singleQuote: true,

  /**
   * 数组&&对象&&参数列表 多行显示时,结尾处是否有","
   *
   * "none" - NO
   * "es5"  - Array,Object YES
   * "all"  - Array,Object,Parameter List YES
   */
  trailingComma: 'none',

  /**
   * 字面对象的大括号之间是否使用空格
   *
   * true  - { a: 1 }
   * false - {a: 1}
   */
  bracketSpacing: true,

  /**
   * 控制单个参数箭头函数的括号:
   * "avoid"  - 无括号 x => x
   * "always" - 有括号 (x) => x
   */
  arrowParens: 'avoid'
}
