import { API_SUCCESS_CODE, HTTP_STATUS_OK } from '@/_shared/constants/code'
import apiAlias from '@/_shared/configs/apiAlias'
import {
  API_BASEPATH,
  API_ALIAS_ENABLED,
  VERSION,
  APPID
} from '@/_shared/configs/env'
import {
  isObject,
  CustomException,
  SDKException,
  filterNonNull
} from '@/_shared/helpers/utils'

const methods = {
  POST: 'POST',
  GET: 'GET',
  DELETE: 'DELETE',
  PUT: 'PUT'
}

const getApiAlias = () => {
  if (
    // dotenv tranform to string
    API_ALIAS_ENABLED === 'true' &&
    Array.isArray(apiAlias) &&
    apiAlias.length
  ) {
    return apiAlias
  }

  return []
}

const defaultHeader = () => ({
  'Content-Type': 'application/json',
  //  小程序 appid
  'x-http-appid': APPID,
  // 客户端版本
  'x-http-version': VERSION,
  // 客户端名称
  'client-name': 'mini-program'
})

const serializeOptions = async options => {
  let url
  let header = defaultHeader()
  let method = methods.POST

  //  token && (header['x-http-token'] = token)

  if (typeof options === 'string') {
    url = `${API_BASEPATH}/${options}`
  }

  if (isObject(options)) {
    // https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html

    if (isObject(options.header)) {
      header = filterNonNull({ ...header, ...options.header })
    }

    if (options.method) {
      method = options.method.toUpperCase()
    }

    if (options.path) {
      url = `${API_BASEPATH}/${options.path}`
    }

    if (options.url) {
      // eslint-disable-next-line prefer-destructuring
      url = options.url
    }
  }

  if (!url)
    return Promise.reject(new CustomException({ message: '请求路径不能为空' }))

  const alias = getApiAlias()

  if (alias.length) {
    const found = alias.find(({ from }) => url.indexOf(from) > -1)

    if (found) {
      const { to } = found

      to && (url = found.to)
    }
  }

  return { header, method, url }
}

const request = async (options, params) => {
  const opts = await serializeOptions(options)

  return new Promise((resolve, reject) => {
    wx.request({
      ...opts,
      data: params || {},
      success: res => {
        const {
          statusCode,
          data,
          data: { code }
        } = res

        if (statusCode !== HTTP_STATUS_OK) {
          try {
            const { error } = JSON.parse(data.message)

            reject(new CustomException({ message: `${statusCode} ${error}` }))
          } catch (e) {
            reject(new CustomException(data))
          }
        } else {
          if (code === API_SUCCESS_CODE) {
            resolve(data)
          } else {
            reject(new CustomException(data))
          }
        }
      },
      fail: error => {
        reject(new SDKException(error))
      }
    })
  })
}

const upload = async filePath => {
  const options = await serializeOptions('file/upload')

  return new Promise((resolve, reject) => {
    wx.uploadFile({
      ...options,
      filePath,
      name: 'file',
      success: res => {
        try {
          const { data: dataString } = res

          const data = JSON.parse(dataString)

          const resData = data.data || {}

          if (data.code === API_SUCCESS_CODE) {
            resolve(resData)
          } else {
            reject(new CustomException(data))
          }
        } catch ({ message }) {
          reject(new CustomException({ message }))
        }
      },
      fail: error => {
        reject(new SDKException(error))
      }
    })
  })
}

const useRequest = (...args) =>
  request(...args)
    .then(res => [null, res])
    .catch(error => [error])

export default request

export { request, upload, useRequest, defaultHeader }
