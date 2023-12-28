const through2 = require('through2')
const path = require('path')
const { existsSync } = require('fs')
const { processContext, gulp, $ } = require('../context')

function projectShouldUpdate() {
  if (!existsSync(path.resolve(process.cwd(), 'project.config.json'))) {
    return true
  }

  const configs = require('../../../project.config.json')

  if (configs.appid !== processContext.APPID) {
    return true
  }

  return false
}

module.exports = cb => {
  if (projectShouldUpdate()) {
    return gulp
      .src('./_project.config.json')
      .pipe(
        through2.obj(function (chunk, _, callback) {
          const { contents } = chunk
          const data = JSON.parse(contents.toString())

          data.appid = processContext.APPID

          chunk.contents = Buffer.from(JSON.stringify(data), 'utf8')

          this.push(chunk)

          callback()
        })
      )
      .pipe($.jsonFormat(2))
      .pipe($.rename('project.config.json'))
      .pipe(gulp.dest('./'))
  } else {
    cb()
  }
}
