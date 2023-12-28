const through2 = require('through2')
const { processContext, args, gulp, $, buildId } = require('../context')

module.exports = () =>
  gulp
    .src('./_project.config.json')
    .pipe(
      through2.obj(function (chunk, enc, callback) {
        const { contents } = chunk
        const data = JSON.parse(contents.toString())

        delete data.miniprogramRoot

        data.projectname = buildId

        data.appid = processContext.APPID

        chunk.contents = Buffer.from(JSON.stringify(data), 'utf8')

        this.push(chunk)

        callback()
      })
    )
    .pipe($.jsonFormat(2))
    .pipe($.rename('project.config.json'))
    .pipe(gulp.dest(args.output))
