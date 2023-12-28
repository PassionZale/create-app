const requireDir = require('require-dir')
const { gulp } = require('./scripts/gulp/context')

// 获取全部任务模块
const tasks = requireDir('./scripts/gulp/tasks', {
  mapKey(_, baseName) {
    // 例: "clean.task" 转换成 "clean"
    const [taskName] = baseName.split('.')

    return taskName
  }
})

gulp.task('clean', tasks.clean)

gulp.task('build:scss', tasks.scss)
gulp.task('build:js', tasks.js)
gulp.task('build:json', tasks.json)
gulp.task('build:wxml', tasks.wxml)
gulp.task('build:wxss', tasks.wxss)
gulp.task('build:wxs', tasks.wxs)
gulp.task('build:others', tasks.others)

gulp.task('project:make', tasks.projectMake)
gulp.task('project:build', tasks.projectBuild)

gulp.task('watch', tasks.watch)

gulp.task('zip', tasks.zip)

gulp.task(
  'build',
  gulp.series(
    'clean',
    gulp.parallel(
      'project:build',
      'build:scss',
      'build:js',
      'build:json',
      'build:wxml',
      'build:wxss',
      'build:wxs',
      'build:others'
    ),
    'zip'
  )
)

gulp.task(
  'default',
  gulp.series(
    'clean',
    gulp.parallel(
      'project:make',
      'build:scss',
      'build:js',
      'build:json',
      'build:wxml',
      'build:wxss',
      'build:wxs',
      'build:others'
    ),
    'watch'
  )
)
