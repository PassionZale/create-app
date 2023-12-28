import { CustomException, SDKException, isObject, promisify } from './utils'

/**
 * 获取当前平台
 * @returns {String} wework 企业微信, wx 微信
 */
export function getPlatform() {
  return wx.qy ? 'wework' : 'wx'
}

/**
 * 同步获取客户端系统信息
 * @returns {Object} 客户端系统信息
 */
export function getSystemInfo() {
  return wx.getSystemInfoSync()
}

/**
 * SDK errMsg 过滤 “取消” “拒绝” 两个场景的异常消息
 * @param {string} errMsg
 * @returns
 */
export function resolveSDKErrMsg(errMsg) {
  if (
    !errMsg ||
    (errMsg.indexOf('fail cancel') === -1 && errMsg.indexOf('deny') === -1)
  ) {
    wx.showToast({ title: errMsg, icon: 'none' })
  }
}

// 企微部分低版本不支持 async/await 模式调用 wx.login 等接口
// 因此在此处使用 promisify 异步化
export const wxLogin = promisify(wx.login)
export const wxCheckSession = promisify(wx.checkSession)
export const wxGetUserProfile = promisify(wx.getUserProfile)
export const wxGetSetting = promisify(wx.getSetting)
export const wxOpenSetting = promisify(wx.openSetting)

/**
 * 保存图片至手机相册
 * https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.saveImageToPhotosAlbum.html
 * 沿用 success fail 回调函数，是为了覆盖 sdk 默认的 toast 交互提示
 * @param {function} success 接口调用成功的回调函数
 * @param {function} fail 接口调用失败的回调函数
 * @returns {Promise}
 */
export async function saveImageToPhotosAlbum({ success, fail, ...options }) {
  const scope = 'scope.writePhotosAlbum'

  const applyPermissionMsg =
    '您未开启保存图片到相册的权限，请点击确定去开启权限！'

  const noPermissionMsg = '未开启保存图片到相册的权限'

  let canIUse = false

  try {
    const { authSetting } = await wxGetSetting()

    // 用户已拒绝权限，则为 false
    // 首次申请权限，则为 undefined，微信会自动发起一次授权
    if (authSetting[`${scope}`] === false) {
      // wx.openSetting() 必须由用户 tap 触发，必须写为同步函数
      wx.showModal({
        title: '提示',
        content: applyPermissionMsg,
        success: async res => {
          if (res.confirm) {
            const { authSetting } = await wxOpenSetting()

            if (authSetting[`${scope}`]) {
              canIUse = true
            } else {
              fail
                ? fail(new SDKException({ message: noPermissionMsg }))
                : wx.showToast({ title: noPermissionMsg, icon: 'none' })
            }
          }
        }
      })
    } else {
      canIUse = true
    }

    if (canIUse) {
      const result = await promisify(wx.saveImageToPhotosAlbum)(options)

      success
        ? success(result)
        : wx.showToast({
            title: '图片已保存相册，请在手机相册查看',
            icon: 'none'
          })
    }
  } catch (error) {
    // exclude "取消保存" 的场景
    if (!error.errMsg || error.errMsg.indexOf('fail cancel') === -1) {
      fail
        ? fail(new SDKException(error))
        : wx.showToast({ title: error.errMsg, icon: 'none' })
    }
  }
}

/**
 * 选择相册图片
 */
export const chooseImage = promisify(wx.chooseImage)

/**
 * 复制指定内容至剪切板
 * @param {string} data 复制的内容
 */
export async function setClipboardData(data) {
  if (typeof data !== 'string')
    throw new SDKException({ message: 'data 必须为字符串类型' })

  try {
    await wx.setClipboardData({ data })

    wx.showToast({ title: '内容已复制', icon: 'none' })
  } catch (error) {
    wx.showToast({ title: '内容无法复制', icon: 'none' })
  }
}

/**
 * 拨打电话
 * @param {string} phoneNumber 电话号码
 */
export async function makePhoneCall(phoneNumber) {
  if (typeof phoneNumber !== 'string')
    throw new SDKException({ message: 'phoneNumber must be string' })

  try {
    await wx.makePhoneCall({ phoneNumber })
  } catch (error) {
    // exclude "取消" 的场景
    if (!error.errMsg || error.errMsg.indexOf('fail cancel') === -1) {
      wx.showToast({ title: error.errMsg, icon: 'none' })

      throw new SDKException(error)
    }
  }
}

/**
 * 添加联系人
 * @param {object} contact 联系人 https://developers.weixin.qq.com/miniprogram/dev/api/device/contact/wx.addPhoneContact.html
 */
export async function addPhoneContact(contact) {
  if (!isObject(contact))
    throw new SDKException({ message: 'contact must be object' })

  const scope = 'scope.addPhoneContact'

  const applyPermissionMsg =
    '您未开启添加到联系人的权限，请点击确定去开启权限！'

  const noPermissionMsg = '未开启保存添加到联系人的权限'

  let canIUse = false

  try {
    const { authSetting } = await wxGetSetting()

    if (authSetting[`${scope}`] === false) {
      wx.showModal({
        title: '提示',
        content: applyPermissionMsg,
        success: async res => {
          if (res.confirm) {
            const { authSetting } = await wxOpenSetting()

            if (authSetting[`${scope}`]) {
              canIUse = true
            } else {
              wx.showToast({ title: noPermissionMsg, icon: 'none' })

              throw new SDKException({ message: noPermissionMsg })
            }
          }
        }
      })
    } else {
      canIUse = true
    }

    if (canIUse) {
      const result = await promisify(wx.addPhoneContact)(contact)

      wx.showToast({
        title: '添加成功',
        icon: 'none'
      })

      return result
    }
  } catch (error) {
    // exclude "取消" && "拒绝" 的场景
    if (
      !error.errMsg ||
      (error.errMsg.indexOf('fail cancel') === -1 &&
        error.errMsg.indexOf('auth deny') === -1)
    ) {
      wx.showToast({ title: error.errMsg, icon: 'none' })

      throw new SDKException(error)
    }
  }
}

/**
 * rpx 转换为 px
 * @param {Number} rpx
 * @returns {Number} px
 */
export function rpx2px(rpx) {
  return (rpx / 750) * getSystemInfo().windowWidth
}

/**
 * px 转换为 rpx
 * @param {Number} px
 * @returns {Number} rpx
 */
export function px2rpx(px) {
  return (px * 750) / getSystemInfo().windowWidth
}

/**
 * 获取当前页面中，选择器为 selector 的第一个node节点
 * @param {String} selector 符合微信小程序规范的选择器
 * @param {Object} context 调用环境，普通页面中为wx，自定义组件中为this；默认值为wx.
 * @return {Promise<Object>} 返回 selector 的 node 节点信息
 */
export const querySelector = function (selector, context = wx) {
  const { screenHeight } = getSystemInfo()

  return new Promise((resolve, reject) => {
    context
      .createSelectorQuery()
      .select(selector)
      .boundingClientRect(res => {
        if (res) {
          resolve({ ...res, screenHeight })
        } else {
          reject(
            new CustomException({
              message: `不存在选择器为 ${selector} 的wxml`
            })
          )
        }
      })
      .exec()
  })
}

/**
 * 获取当前页面中，选择器为 selector 的所有node节点
 * @param {String} selector 符合微信小程序规范的选择器
 * @param {Object} context 调用环境，普通页面中为wx，自定义组件中为this；默认值为wx.
 * @return {Promise<[Object]>} 返回一个数组，每个元素为 node 节点
 */
export const querySelectorAll = function (selector, context = wx) {
  const { screenHeight } = getSystemInfo()

  return new Promise((resolve, reject) => {
    context
      .createSelectorQuery()
      .selectAll(selector)
      .boundingClientRect(res => {
        if (res && res.length) {
          resolve(res.map(item => ({ ...item, screenHeight })))
        } else {
          reject(
            new CustomException({
              message: `不存在选择器为 ${selector} 的wxml`
            })
          )
        }
      })
      .exec()
  })
}
