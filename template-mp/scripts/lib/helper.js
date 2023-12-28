const path = require('path')
const through2 = require('through2')
const clc = require('cli-color')

// 时间格式化
function dateFormatter(time, reg) {
  const date = typeof time === 'string' ? new Date(time) : time
  const map = {}

  map.yyyy = date.getFullYear()
  map.yy = `${map.yyyy}`.substring(2)
  map.M = date.getMonth() + 1
  map.MM = (map.M < 10 ? '0' : '') + map.M
  map.d = date.getDate()
  map.dd = (map.d < 10 ? '0' : '') + map.d
  map.H = date.getHours()
  map.HH = (map.H < 10 ? '0' : '') + map.H
  map.m = date.getMinutes()
  map.mm = (map.m < 10 ? '0' : '') + map.m
  map.s = date.getSeconds()
  map.ss = (map.s < 10 ? '0' : '') + map.s

  return reg.replace(/\byyyy|yy|MM|M|dd|d|HH|H|mm|m|ss|s\b/g, $1 => map[$1])
}

/**
 * 文件迁移记录打印
 */
function migration(action = 'migrate') {
  return through2.obj(function (file, enc, cb) {
    const type = path.extname(file.path).slice(1).toLowerCase()

    const time = clc.cyan(
      `[${dateFormatter(new Date(), 'yyyy-MM-dd HH:mm:ss')}]`
    )
    const extname = clc.green(type)

    console.log(
      `${time} ${clc.green(action)} [${extname}] ${clc.cyan('=>')} ${file.path}`
    )

    this.push(file)
    cb()
  })
}

module.exports = {
  dateFormatter,
  migration
}
