const { processContext, args, gulp, $, aliasConfig } = require('../context')

module.exports = () =>
  gulp
    .src('./src/**/*.wxml')
    .pipe($.miniprogramPathAlias(aliasConfig))
    .pipe($.preprocess({ context: processContext, type: 'html' }))
    .pipe(gulp.dest(args.output))
