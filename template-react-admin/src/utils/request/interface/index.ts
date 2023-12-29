import { AxiosRequestConfig } from 'axios'

/**
 * 接口响应数据结构
 */
export interface ResponseDTO<T = any> {
  /** 应用名称 */
  appName: string
  /** elk traceid */
  traceId: string
  /** 接口返回业务编码 */
  code: number
  /** 接口返回提示语 */
  message: string
  /** 接口返回值 */
  result: T
  /** 接口响应耗时 */
  responseTime: number
  /** 接口响应时间戳 */
  timestamp: number
}

export interface RequestDTO<T = any> {
  /** 参数 */
  param: T
}

/**
 * 业务编码
 */
export enum BIZ_CODES {
  /** 接口请求成功 */
  SUCCESS = 200,
  /** 登录过期 */
  JWT_EXPIRED = 1008611
}
