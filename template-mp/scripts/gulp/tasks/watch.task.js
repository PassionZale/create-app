const { gulp } = require('../context')

module.exports = cb => {
  const { parallel } = gulp

  gulp.watch(
    './src/**/*.scss',
    { delay: 300, events: ['add', 'addDir', 'change'] },
    parallel('build:scss')
  )
  gulp.watch(
    './src/**/*.wxss',
    { delay: 300, events: ['add', 'addDir', 'change'] },
    parallel('build:wxss')
  )
  gulp.watch(
    ['./src/**/*.js'],
    { delay: 300, events: ['add', 'addDir', 'change'] },
    parallel('build:js')
  )
  gulp.watch(
    './src/**/*.wxs',
    { delay: 300, events: ['add', 'addDir', 'change'] },
    parallel('build:wxs')
  )
  gulp.watch(
    './src/**/*.json',
    { delay: 300, events: ['add', 'addDir', 'change'] },
    parallel('build:json')
  )
  gulp.watch(
    './src/**/*.wxml',
    { delay: 300, events: ['add', 'addDir', 'change'] },
    parallel('build:wxml')
  )
  gulp.watch(
    './src/**/*.!(scss|wxss|js|wxs|json|wxml|md)',
    { delay: 300, events: ['add', 'addDir', 'change'] },
    parallel('build:others')
  )

  cb()
}
