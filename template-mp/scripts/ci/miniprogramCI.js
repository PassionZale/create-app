const fse = require('fs-extra')
const path = require('path')
const clc = require('cli-color')
const { preview, Project, upload } = require('miniprogram-ci')
const Table = require('cli-table3')
const { getPackageName, getFormatFileSize } = require('./utils')
const logger = require('../lib/logger')

class MiniProgramCI {
  constructor(workspace) {
    this.workspace = workspace

    if (this.loadProjectConfig(workspace)) {
      this.project = new Project({
        appid: this.appid,
        type: this.compileType,
        projectPath: this.workspace,
        privateKeyPath: this.privateKeyPath
      })
    }
  }

  loadProjectConfig(workspace) {
    const projectConfigPath = path.join(workspace, 'project.config.json')
    const packagePath = path.join(workspace, '../package.json')

    if (
      fse.pathExistsSync(projectConfigPath) &&
      fse.pathExistsSync(packagePath)
    ) {
      try {
        const {
          setting,
          appid,
          compileType,
          projectname
        } = fse.readJSONSync(projectConfigPath)
        const { version } = fse.readJSONSync(packagePath)

        this.appid = appid
        this.setting = setting
        this.compileType = compileType
        this.desc = decodeURIComponent(projectname)
        this.version = version

        const privateKeyPath = path.join(
          workspace,
          `../scripts/ci/keys/private.${appid}.key`
        )

        if (fse.pathExistsSync(privateKeyPath)) {
          this.privateKeyPath = privateKeyPath

          return true
        } else {
          console.log(
            `[${clc.red('✗')}] ${clc.red(clc.bold('上传秘钥不存在'))}`
          )

          return false
        }
      } catch (error) {
        console.log(`[${clc.red('✗')}] ${clc.red(clc.bold('读取文件失败'))}`)

        return false
      }
    } else {
      console.log(`[${clc.red('✗')}] ${clc.red(clc.bold('工程文件不存在'))}`)

      return false
    }
  }

  printResult(result) {
    const { subPackageInfo = [], pluginInfo = [], devPluginId = '无' } = result

    const table = new Table({
      head: ['时间', '版本号', '项目备注']
    })

    table.push([new Date().toLocaleString(), this.version, this.desc])

    console.log(table.toString())

    console.log('包信息')

    const packageTable = new Table({
      head: ['类型', '大小']
    })

    subPackageInfo.forEach(packageInfo => {
      const formatSize = getFormatFileSize(packageInfo.size)

      packageTable.push([
        getPackageName(packageInfo.name),
        formatSize.size + formatSize.measure
      ])
    })

    console.log(packageTable.toString())

    if (pluginInfo && pluginInfo.length) {
      console.log('插件信息')

      const pluginTable = new Table({
        head: ['appid', '版本', '大小', 'devPluginId']
      })

      pluginInfo.forEach(pluginInfo => {
        const formatSize = getFormatFileSize(pluginInfo.size)

        pluginTable.push([
          pluginInfo.pluginProviderAppid,
          pluginInfo.version,
          formatSize.size + formatSize.measure,
          devPluginId
        ])
      })

      console.log(pluginTable.toString())
    }
  }

  relsoveQrPath(qrcodeFormat, qrcodeOutputDest) {
    if (qrcodeFormat === 'base64' || qrcodeFormat === 'image') {
      return path.join(this.workspace, qrcodeOutputDest || 'preview.png')
    }

    return ''
  }

  get robot() {
    return Math.floor(Math.random() * 31)
  }

  async upload() {
    if (this.project) {
      try {
        console.log(`[${clc.green('→')}] 开始上传...`)

        const uploadResult = await upload({
          project: this.project,
          version: this.version,
          desc: this.desc,
          setting: this.setting,
          onProgressUpdate() {},
          robot: this.robot
        })

        console.log(`[${clc.green('✓')}] 上传成功`)

        this.printResult(uploadResult)
      } catch (error) {
        logger.fatal(error)
      }
    }
  }

  async preview(opts = {}) {
    const { qrcodeFormat = 'image', qrcodeDest } = opts

    if (this.project) {
      try {
        console.log(`[${clc.green('→')}] 开始预览...`)

        const previewResult = await preview({
          project: this.project,
          version: this.version,
          desc: this.desc,
          setting: this.setting,
          qrcodeFormat,
          qrcodeOutputDest: this.relsoveQrPath(qrcodeFormat, qrcodeDest),
          onProgressUpdate() {},
          robot: this.robot
        })

        console.log(`[${clc.green('✓')}] 预览成功`)

        this.printResult(previewResult)
      } catch (error) {
        logger.fatal(error)
      }
    }
  }
}

module.exports = MiniProgramCI
