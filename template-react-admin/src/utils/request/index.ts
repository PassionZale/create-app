import { unstable_batchedUpdates } from 'react-dom'
import axios, {
  AxiosResponse,
  AxiosRequestConfig,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosInstance
} from 'axios'
import useUserStore from '@/store/user'
import { BASE_URL_DEFAULT } from '@/constants'

import { BIZ_CODES, ResponseDTO } from './interface'

const logout = () => {
  unstable_batchedUpdates(() => {
    useUserStore.getState().reset()

    window.location.replace('/login')
  })
}

// Get 请求时，将泛型 D 覆盖给 params
interface AxiosRequestGetConfig<D = any> extends AxiosRequestConfig<D> {
  params?: D
  data?: any
}

class HttpRequest {
  service: AxiosInstance

  constructor() {
    this.service = axios.create({
      baseURL: BASE_URL_DEFAULT,
      timeout: parseInt(import.meta.env.ADMIN_AXIOS_TIMEOUT)
    })

    this.service.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const { userInfo } = useUserStore.getState()

        if (userInfo?.accessToken) {
          config.headers['Authorization'] = `Bearer ${userInfo.accessToken}`
        }
        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      },
      {
        synchronous: true,
        runWhen: (_: InternalAxiosRequestConfig) => true
      }
    )

    this.service.interceptors.response.use(
      (response: AxiosResponse<ResponseDTO>): AxiosResponse['data'] => {
        const { data } = response

        const { code, message, ...rest } = data

        // 确保 message 一定有值
        const _message = message || '网络开小差~'

        const _data = { code, message: _message, ...rest }

        if (code === BIZ_CODES.SUCCESS) {
          return _data
        } else {
          switch (code) {
            case BIZ_CODES.JWT_EXPIRED:
              logout()
              break

            default:
              break
          }

          return Promise.reject(_data)
        }
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )
  }

  _request<T = any, D = any>(config: AxiosRequestConfig<D>): Promise<ResponseDTO<T>> {
    return new Promise((resolve, reject) => {
      try {
        this.service
          .request<ResponseDTO<T>>(config)
          .then((res: AxiosResponse['data']) => {
            resolve(res as ResponseDTO<T>)
          })
          .catch(err => {
            reject(err)
          })
      } catch (err) {
        return Promise.reject(err)
      }
    })
  }

  get<T = any, D = any>(
    url: string,
    config?: AxiosRequestGetConfig<D>
  ): Promise<ResponseDTO<T>> {
    return this._request({ method: 'GET', url, ...config })
  }

  post<T = any, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<ResponseDTO<T>> {
    return this._request({ method: 'POST', url, ...config })
  }

  put<T = any, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<ResponseDTO<T>> {
    return this._request({ method: 'PUT', url, ...config })
  }

  delete<T = any, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<ResponseDTO<T>> {
    return this._request({ method: 'DELETE', url, ...config })
  }

  upload<T = any, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<ResponseDTO<T>> {
    const uploadConfig = { headers: { 'Content-Type': 'multipart/form-data' }, ...config }

    return this._request({ method: 'POST', url, ...uploadConfig })
  }
}

const request = new HttpRequest()

export { request }
