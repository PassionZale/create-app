const { execSync } = require('child_process')
const path = require('path')
const through2 = require('through2')
const gulp = require('gulp')
const $ = require('gulp-load-plugins')({ DEBUG: false, lazy: true })
const yargs = require('yargs/yargs')

const { dateFormatter, migration } = require('../lib/helper')
const logger = require('../lib/logger')

const args = yargs(yargs.hideBin(process.argv)).argv

const exec = command => {
  try {
    const result = execSync(command, { stdio: 'pipe' })

    return result.toString().replace(/(\r\n|\n|\r)/gm, '')
  } catch (error) {
    return null
  }
}

const userName = exec('git config user.name')
const userEmail = exec('git config user.email')

// 作者
const author = userName
  ? userEmail
    ? `${userName}<${userEmail}>`
    : userName
  : 'official-mp-generator'

// 组件名
const component = args.component || args.c

// 页面名
const page = args.page || args.p

// 分包名，例："home" "customer/order" 等
// 若不指定
// 组件则会创建至 "./src/_shared/components/" 中
// 页面则会创建至 "./src/home/pages/" 中
const _system = args.system || args.s
// 排除 "home" 目录，"home" 为主包
const system = _system === 'home' && page ? undefined : _system

// 模式，用于日志字符串拼接
const mode = page ? 'page' : 'component'

// 上下文变量
const processContext = {
  FILENAME: component || page,
  AUTHOR: author,
  DATE: dateFormatter(new Date(), 'yyyy-MM-dd')
}

// 文件名称
let fileName
// 输出目录
let output

if (mode === 'component') {
  const targetFolder = system
    ? `./src/${system}/components`
    : `./src/_shared/components`

  fileName = component
  output = path.resolve(process.cwd(), targetFolder, fileName)
}

if (mode === 'page') {
  const targetFolder = system ? `./src/${system}/pages` : `./src/home/pages`

  fileName = page

  output = path.resolve(process.cwd(), targetFolder, fileName)
}

validate()

run()

// 参数校验
function validate() {
  if (!component && !page) {
    logger.fatal(new Error('必须指定页面或组件名称'))
  }

  if (component && page) {
    logger.fatal(new Error('不能同时创建页面和组件'))
  }

  if (!output) {
    logger.fatal(new Error('无法解析出 output'))
  }
}

async function run() {
  try {
    await migrateJs()
    await migrateScss()
    await migrateOthers()
    await generateAppJson()

    logger.success(
      `${mode} has created @ ${path.resolve(process.cwd(), output)}`
    )
  } catch (error) {
    logger.fatal(error)
  }
}

// 迁移 js
function migrateJs() {
  return new Promise((resolve, reject) => {
    const stream = gulp
      .src(path.resolve(__dirname, `tpl/${mode}/tpl.js`))
      .pipe($.preprocess({ context: processContext, type: 'js' }))
      .pipe($.rename({ basename: fileName, extname: '.js' }))
      .pipe(migration())
      .pipe(gulp.dest(output))

    stream.on('end', () => resolve())

    stream.on('error', err => reject(err))
  })
}

// 迁移 scss
function migrateScss() {
  return new Promise((resolve, reject) => {
    const stream = gulp
      .src(path.resolve(__dirname, `tpl/${mode}/tpl.scss`))
      .pipe($.preprocess({ context: processContext, type: 'css' }))
      .pipe($.rename({ basename: fileName, extname: '.scss' }))
      .pipe(migration())
      .pipe(gulp.dest(output))

    stream.on('end', () => resolve())

    stream.on('error', err => reject(err))
  })
}

// 迁移 wxml json
function migrateOthers() {
  return new Promise((resolve, reject) => {
    const stream = gulp
      .src(path.resolve(__dirname, `tpl/${mode}/tpl.!(js|scss)`))
      .pipe($.preprocess({ context: processContext, type: 'html' }))
      .pipe(
        $.rename(p => {
          p.basename = fileName
        })
      )
      .pipe(migration())
      .pipe(gulp.dest(output))

    stream.on('end', () => resolve())

    stream.on('error', err => reject(err))
  })
}

// 更新 page route
function generateAppJson() {
  return new Promise((resolve, reject) => {
    if (mode !== 'page') return resolve()

    const stream = gulp
      .src(path.resolve(process.cwd(), './src/app.json'))
      .pipe(
        through2.obj(function (chunk, enc, callback) {
          const { contents } = chunk
          const data = JSON.parse(contents.toString())

          // 主包，则直接添加路由
          // 分包，则添加至分包的路由中
          if (!system) {
            const { pages = [] } = data

            const route = `home/pages/${fileName}/${fileName}`

            const found = pages.find(item => item === route)

            if (found === undefined) {
              pages.push(route)
            }
          } else {
            const { subPackages } = data

            const route = `pages/${fileName}/${fileName}`

            if (!subPackages || subPackages.length === 0) {
              data.subPackages = []
              data.subPackages.push({
                root: system,
                pages: [route]
              })
            } else {
              const index = subPackages.findIndex(item => item.root === system)

              if (index > -1) {
                const isExist = subPackages[index].pages.findIndex(
                  item => item === route
                )

                if (isExist === -1) subPackages[index].pages.push(route)
              } else {
                subPackages.push({
                  root: system,
                  pages: [route]
                })
              }
            }
          }

          chunk.contents = Buffer.from(JSON.stringify(data), 'utf8')

          this.push(chunk)

          callback()
        })
      )
      .pipe($.jsonFormat(2))
      .pipe(migration('generate'))
      .pipe(gulp.dest(path.resolve(process.cwd(), './src/')))

    stream.on('end', () => resolve())

    stream.on('error', err => reject(err))
  })
}
