const { args, gulp } = require('../context')

module.exports = () => gulp.src('./src/**/*.json').pipe(gulp.dest(args.output))
