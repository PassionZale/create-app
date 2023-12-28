const { processContext, args, gulp, $, aliasConfig } = require('../context')

module.exports = () =>
  gulp
    .src('./src/**/*.wxs')
    .pipe($.miniprogramPathAlias(aliasConfig))
    .pipe($.preprocess({ context: processContext, type: 'js' }))
    .pipe(gulp.dest(args.output))
