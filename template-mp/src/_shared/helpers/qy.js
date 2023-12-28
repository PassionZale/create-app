import { CustomException, promisify, SDKException } from './utils'

const SDKEnhancer = {
  // 判断 session 是否过期
  checkSession: wx.qy && promisify(wx.qy.checkSession),

  // 快速跳转到添加客户的界面 https://developer.work.weixin.qq.com/document/path/93864
  navigateToAddCustomer: wx.qy && promisify(wx.qy.navigateToAddCustomer),

  // 打开会话 https://developer.work.weixin.qq.com/document/path/91519
  openEnterpriseChat: wx.qy && promisify(wx.qy.openEnterpriseChat)
}

/**
 * SDK errMsg 过滤 “取消”, 并转义特殊场景的 errMsg 文案
 * @param {string} errMsg
 */
export function resolveSDKErrMsg(errMsg) {
  if (!errMsg || errMsg.indexOf('fail cancel') === -1) {
    let title = errMsg

    if (errMsg.indexOf('no permission') > -1) {
      title = '请配置客户联系功能'
    }

    if (errMsg.indexOf('unsupported chat') > -1) {
      title = '仅支持打开客户群'
    }

    wx.showToast({ title, icon: 'none' })
  }
}

/**
 * 企微登录
 */
export const login = wx.qy && promisify(wx.qy.login)

/**
 * 企微校验 session 是否过期，过期则重新调用 login()
 */
export async function checkSession() {
  try {
    await SDKEnhancer.checkSession()
  } catch (error) {
    console.warn('session_key 失效，重新调用 wx.qy.login 中...')

    return await login()
  }
}

/**
 * (添加客户) - 快速跳转到添加客户的界面
 */
export async function navigateToAddCustomer() {
  await checkSession()

  try {
    await SDKEnhancer.navigateToAddCustomer()
  } catch (error) {
    resolveSDKErrMsg(error.errMsg)

    throw new SDKException(error)
  }
}

/**
 * (联系客户) - 打开会话
 * @param {string} externalUserId 外部联系人ID
 */
export async function openEnterpriseChat(externalUserId) {
  if (!externalUserId) {
    throw new CustomException({ message: 'externalUserId 不能为空' })
  }

  await checkSession()

  try {
    await SDKEnhancer.openEnterpriseChat({
      externalUserIds: externalUserId,
      groupName: ''
    })
  } catch (error) {
    resolveSDKErrMsg(error.errMsg)

    throw new SDKException(error)
  }
}
