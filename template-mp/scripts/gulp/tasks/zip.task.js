const { args, gulp, $, buildId } = require('../context')

module.exports = () =>
  gulp
    .src(`${args.output}/**`)
    .pipe($.zip(`${buildId}.zip`))
    .pipe(gulp.dest('./'))
