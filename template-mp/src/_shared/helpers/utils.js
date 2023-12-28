import { EXCEPTION_ERROR_MESSAGE } from '../constants/text'

/**
 * 将回调形式的函数做一个 promise 封装
 * @param {*} func
 * @returns {Promise}
 */
export const promisify = fn => options =>
  new Promise((resolve, reject) => {
    fn({
      ...options,
      success: resolve,
      fail: reject
    })
  })

/**
 * 判断输入值是否为一个数组
 * @param {*} input
 * @returns {boolean} true/false
 */
export function isArray(input) {
  return !!input && Object.prototype.toString.call(input) === '[object Array]'
}

/**
 * 判断输入值是否为一个对象
 * @param {*} input
 * @returns {boolean} true/false
 */
export function isObject(input) {
  return typeof input === 'object' && !Array.isArray(input) && input != null
}

/**
 * 判断输入值是否为一个数字
 * @param {*} input
 * @returns {boolean} true/false
 */
export function isNumber(input) {
  return !isNaN(input) && input !== null && !isArray(input)
}

/**
 * 过滤对象中 value 为 null 和 undefined 的 key
 * @param {object} input
 * @returns
 */
export function filterNonNull(input) {
  return Object.fromEntries(
    Object.entries(input).filter(([k, v]) => !(v === null || v === undefined))
  )
}

/**
 * 自定义异常, 数据结构与 api response 相似
 * {
 *  "code": => 可选字段，非 200 的整数，默认为 5000
 *  "data": => 可选字段，用于自定义数据
 *  "message" => 必填字段，用于错误原因说明
 *  "timestamp" => 默认填充 当前时间戳（毫秒）
 *  "name" => 默认填充 'CustomException'
 * }
 */
export class CustomException {
  constructor({ code = 5000, data, message }) {
    this.code = code
    this.data = data
    this.message = message || EXCEPTION_ERROR_MESSAGE
    this.timestamp = +new Date()
    this.name = 'CustomException'
  }
}

/**
 * 自定义微信或企微 SDK 异常
 * https://developers.weixin.qq.com/miniprogram/dev/framework/usability/PublicErrno.html
 * {
 *  "errMsg": "openBluetoothAdapter:fail:not available",
 *  "errCode": 10001,
 *  "errno": 1500102,
 *  "code": => 可选字段，非 200 的整数，若设置了值，"errno" 和 "errCode" 会失效
 *  "data": => 可选字段，用于自定义数据
 *  "message": => 可选字段，用于捕获其他 js 错误，或自定义错误信息
 *  "timestamp" => 默认填 充当前时间戳（毫秒）
 *  "name" => 默认填充 'SDKException'
 * }
 */
export class SDKException {
  constructor({ errMsg, errCode, errno, code, message, data }) {
    this.code = code || errno || errCode || 5000
    this.data = data
    this.message = message || errMsg || EXCEPTION_ERROR_MESSAGE
    this.timestamp = +new Date()
    this.name = 'SDKException'
  }
}

/**
 * 手机号空格，13333333333 => "133 3333 3333"
 * @param {number} phone 手机号
 * @returns {string} "133 3333 3333"
 */
export function phoneNumberSpaceable(phone) {
  if (phone) {
    phone = `${phone}`.replace(/(\d{3})(\d{0,4})(\d{0,4})/, '$1 $2 $3')
  }

  return phone
}

/**
 * 手机号脱敏，13333333333 => "133****3333"
 * @param {number} phone 手机号
 * @returns {string} "133****3333"
 */
export function phoneNumberEncrypt(phone) {
  if (phone) {
    const reg = /(\d{3})\d*(\d{4})/

    phone = phone.replace(reg, '$1****$2')
  }

  return phone
}

/**
 * 延迟 wait 毫秒
 * @param {number} wait 等待毫秒数
 * @returns
 */
export function delay(wait) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, wait)
  })
}

/**
 * queryObj to string
 * @param {object} queryObj
 * @returns string
 */
export function queryToString(queryObj) {
  const str = []

  const query = filterNonNull(queryObj)

  for (const p in query) {
    // eslint-disable-next-line no-prototype-builtins
    if (query.hasOwnProperty(p)) {
      str.push(`${encodeURIComponent(p)}=${encodeURIComponent(query[p])}`)
    }
  }

  return str.join('&')
}

/**
 * queryString to object
 * @param {string} queryString
 * @returns obj
 */
export function queryToObject(queryString) {
  queryString.split('&').reduce((obj, item, i) => {
    if (item) {
      item = item.split('=')
      obj[item[0]] = item[1]

      return obj
    }
  }, {})
}

/**
 * 组合小程序 Path 和 QueryObject，并过滤 QueryObject 中 value 为 undefined 或 null 的键值对
 * @param {string} path 绝对路径
 * @param {object} options queryObject 选填
 * @returns string
 * @example
 * resolvePath('/home/pages/index/index', { tab: 'customer_home', foo: 'bar' })
 * =>
 * '/home/pages/index/index?tab=customer_home&foo=bar'
 */
export function resolvePath(path, options) {
  const reg = /^\/([A-z0-9-_+]+\/)*([A-z0-9]+)$/

  if (!reg.test(path)) {
    throw new CustomException({ message: 'path 必须为绝对路径' })
  }

  return isObject(options) ? `${path}?${queryToString(options)}` : path
}
