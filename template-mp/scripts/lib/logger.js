const clc = require('cli-color')
const { format } = require('util')

/**
 * Prefix.
 */
const prefix = '   mp-starter'
const sep = clc.cyan('·')

/**
 * 在控制台中打印 `message`
 *
 * @param {String} message
 */
exports.log = function (...args) {
  const msg = format.apply(format, args)

  console.log(clc.white(prefix), clc.white(sep), clc.white(msg))
}

exports.warn = function (...args) {
  const msg = format.apply(format, args)

  console.log(clc.yellow(prefix), clc.yellow(sep), clc.yellow(msg))
}

/**
 * 在控制台中打印 `error message`，并退出进程
 *
 * @param {String} message
 */
exports.fatal = function (...args) {
  if (args[0] instanceof Error) args[0] = args[0].message.trim()
  const msg = format.apply(format, args)

  console.error(clc.red(prefix), clc.red(sep), clc.red(msg))
  process.exit(1)
}

/**
 * 在控制台中打印 `success message`
 *
 * @param {String} message
 */
exports.success = function (...args) {
  const msg = format.apply(format, args)

  console.log(clc.green(prefix), clc.green(sep), clc.green(msg))
}
