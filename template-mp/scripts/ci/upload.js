const clc = require('cli-color')
const fse = require('fs-extra')
const context = require('./context')
const { runExec } = require('./utils')
const CI = require('./miniprogramCI')

const {
  env,
  repoName,
  repoPath,
  cloneCommand,
  installCommand,
  buildCommand,
  workspace
} = context

run()

async function run() {
  try {
    // 清理工作目录
    console.log(
      `[${clc.green('→')}] [${clc.blue(
        clc.bold(repoName)
      )}] 清理工作空间: ${repoPath}`
    )
    await fse.emptyDir(repoPath)

    // 克隆代码
    console.log(
      `[${clc.green('→')}] [${clc.blue(clc.bold(repoName))}] 开始克隆仓库...`
    )
    console.log()
    await runExec(cloneCommand)

    // 安装依赖
    console.log(
      `[${clc.green('→')}] [${clc.blue(clc.bold(repoName))}] 开始安装依赖...`
    )
    console.log()
    await runExec(installCommand)

    // 构建应用
    console.log(
      `[${clc.green('→')}] [${clc.blue(
        clc.bold(repoName)
      )}] 开始构建应用: ${env}`
    )
    console.log()
    await runExec(buildCommand)
    console.log(
      `[${clc.green('✓')}] [${clc.blue(clc.bold(repoName))}] 构建成功`
    )

    new CI(workspace).upload()
  } catch (error) {
    console.log(
      `[${clc.red('✗')}] [${clc.blue(clc.bold(repoName))}] ${clc.red(
        clc.bold('请检查网络设置或者应用配置')
      )}`
    )

    console.log(error.toString().trim().split(/\r?\n/))
  }
}
