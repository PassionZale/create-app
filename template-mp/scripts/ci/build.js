const clc = require('cli-color')
const fse = require('fs-extra')
const path = require('path')
const context = require('./context')
const { runExec, getBuildName } = require('./utils')

const { env, repoName, repoPath, cloneCommand, installCommand, buildCommand } =
  context

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

    // 拷贝输出文件至 process.cwd()
    const fileName = getBuildName(repoPath)

    console.log(
      `[${clc.green('→')}] [${clc.blue(
        clc.bold(repoName)
      )}] 开始拷贝文件: ${fileName}`
    )

    await fse.copy(
      path.join(repoPath, fileName),
      path.join(process.cwd(), fileName)
    )

    // 移除工作目录
    await fse.emptyDir(repoPath)
    console.log(
      `[${clc.green('✓')}] [${clc.blue(clc.bold(repoName))}] 拷贝完成`
    )
  } catch (error) {
    console.log(
      `[${clc.red('✗')}] [${clc.blue(clc.bold(repoName))}] ${clc.red(
        clc.bold('请检查网络设置或者应用配置')
      )}`
    )

    console.log(error.toString().trim().split(/\r?\n/))
  }
}
