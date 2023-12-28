const { processContext, args, gulp, $, aliasConfig } = require('../context')

module.exports = () =>
  gulp
    .src('./src/**/*.wxss')
    .pipe($.miniprogramPathAlias(aliasConfig))
    .pipe($.preprocess({ context: processContext, type: 'css' }))
    .pipe(gulp.dest(args.output))
