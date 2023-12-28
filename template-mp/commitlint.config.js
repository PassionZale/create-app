module.exports = {
  // 继承默认配置
  extends: ['@commitlint/config-angular'],
  // 自定义规则
  rules: {
    'type-case': [2, 'always', 'lower-case'],
    'type-enum': [
      2,
      'always',
      [
        'wip', // 开发中
        'update', // 功能改动
        'feat', // 新增功能
        'del', // 功能或者文件删除
        'perf', // 性能, 体验优化
        'fix', // bug 修复
        'format', // 不影响程序逻辑的代码修改(修改空白字符，格式缩进，补全缺失的分号等，没有改变代码逻辑)
        'config', // 修改或添加配置文件
        'refactor', // 重构代码(既没有新增功能，也没有修复 bug)
        'doc', // 文档更新
        'test', // 新增测试用例或是更新现有测试
        'revert', // 回退版本
        'build', // 主要目的是修改项目构建系统(例如 glup，webpack，rollup 的配置等)的提交
        'chore' // 不属于以上类型的其他类型
      ]
    ],
    'header-max-length': [0, 'always', 72]
  }
}
