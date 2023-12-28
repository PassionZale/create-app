const { args, gulp } = require('../context')

module.exports = () =>
  gulp
    .src(['./src/**/*.!(scss|wxss|js|wxs|json|wxml|md)'], {
      dot: true,
      nodir: true
    })
    .pipe(gulp.dest(args.output))
