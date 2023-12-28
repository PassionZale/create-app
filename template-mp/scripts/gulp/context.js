const { existsSync } = require('fs')
const gulp = require('gulp')
const $ = require('gulp-load-plugins')({ DEBUG: false, lazy: true })
const path = require('path')
const dotenvFlow = require('dotenv-flow')

const yargs = require('yargs/yargs')
const args = yargs(yargs.hideBin(process.argv)).argv

const pkg = require('../../package.json')

const { dateFormatter } = require('../lib/helper')
const logger = require('../lib/logger')

const { env = 'dev', ignoreLocal } = args

const variables = parseENV()

const buildId = `${pkg.name}_${env}_v${pkg.version}_${dateFormatter(
  new Date(),
  'yyyyMMddHHmmss'
)}`

const aliasConfig = {
  '@': path.resolve(process.cwd(), 'src')
}

const processContext = {
  ENV: env.toUpperCase(),
  VERSION: pkg.version,
  ...variables
}

function parseENV() {
  const envPath = path.resolve(process.cwd(), `.env.${env}`)
  const envLocalPath = path.resolve(process.cwd(), `.env.local`)

  // gulp build 时，忽略 .env.local
  const envs =
    existsSync(envLocalPath) && !ignoreLocal
      ? [envPath, envLocalPath]
      : [envPath]

  try {
    const variables = dotenvFlow.parse(envs)

    const { APPID, API_BASEPATH } = variables

    if (!APPID || !API_BASEPATH) {
      logger.fatal('APPID, API_BASEPATH 必填，请检查 .env 配置文件')
    }

    return variables
  } catch (error) {
    logger.fatal(error)
  }
}

process.once('SIGINT', () => {
  process.exit(0)
})

module.exports = {
  gulp,
  $,
  args: { output: 'dist', ...args },
  aliasConfig,
  buildId,
  processContext,
  logger
}
