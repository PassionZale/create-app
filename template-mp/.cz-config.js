module.exports = {
  types: [
    { value: 'wip',         name : 'wip:               开发中' },
    { value: 'update',      name : 'update:            功能改动' },
    { value: 'feat',        name : 'feat:              新增功能' },
    { value: 'del',         name : 'del:               功能或者文件删除' },
    { value: 'perf',        name : 'perf:              性能, 体验优化' },
    { value: 'fix',         name : 'fix:               修复 Bug' },
    { value: 'format',      name : 'format:            格式化代码，不影响功能，例如空格、代码格式等' },
    { value: 'config',      name : 'config:            修改或添加配置文件' },
    { value: 'refactor',    name : 'refactor:          重构代码(既没有新增功能，也没有修复 bug)' },
    { value: 'doc',         name : 'doc:               文档更新' },
    { value: 'test',        name : 'test:              新增测试用例或是更新现有测试' },
    { value: 'revert',      name : 'revert:            回退版本' },
    { value: 'build',       name : 'build:             修改项目构建系统(例如 glup 的配置等)的提交' },
    { value: 'chore',       name : 'chore:             杂务，不属于以上类型，例如run build、引入或更新软件包等' },
  ],

  messages: {
    type: '选择一种你的提交类型:',
    scope: '选择修改涉及范围 (可选):',
    customScope: '请输入本次改动的范围（如：功能、模块等）(可选):',
    subject: '简短说明:\n',
    body: '详细说明，使用"|"分隔开可以换行(可选)：\n',
    breaking: '非兼容性，破坏性变化说明 (可选):\n',
    footer: '关联关闭的issue，例如：#31, #34(可选):\n',
    confirmCommit: '确定提交说明?'
  },
}
