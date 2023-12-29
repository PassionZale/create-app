/** moment 格式化 */
export const MOMENT_FORMMATER = 'YYYY-MM-DD HH:mm:ss'

/** axios.baseURL 默认 */
export const BASE_URL_DEFAULT = import.meta.env.PROD
  ? import.meta.env.ADMIN_AXIOS_BASE_URL
  : import.meta.env.ADMIN_VITE_SERVER_PROXY

/** axios.baseURL multiple-a */
export const BASE_URL_2C = import.meta.env.PROD
  ? import.meta.env.ADMIN_AXIOS_BASE_URL_MULTIPLE_A
  : import.meta.env.ADMIN_VITE_SERVER_PROXY_MULTIPLE_A

/** axios.baseURL multiple-b */
export const BASE_URL_YST = import.meta.env.PROD
  ? import.meta.env.ADMIN_AXIOS_BASE_URL_MULTIPLE_B
  : import.meta.env.ADMIN_VITE_SERVER_PROXY_MULTIPLE_B