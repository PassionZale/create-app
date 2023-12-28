const { processContext, args, gulp, $, aliasConfig } = require('../context')

module.exports = () =>
  gulp
    .src(['./src/**/*.scss', '!./src/_shared/styles/*.scss'])
    .pipe($.miniprogramPathAlias(aliasConfig))
    .pipe($.dartSass.sync({ outputStyle: 'compressed' }))
    .on('error', $.dartSass.logError)
    .pipe($.preprocess({ context: processContext, type: 'css' }))
    .pipe(
      $.rename({
        extname: '.wxss'
      })
    )
    .pipe(gulp.dest(args.output))
