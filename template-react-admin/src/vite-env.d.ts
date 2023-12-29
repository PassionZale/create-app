/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 应用名称，展示在 document.title */
  readonly ADMIN_APP_NAME: string

  /** axios.timeout */
  readonly ADMIN_AXIOS_TIMEOUT: string

  /** server.port */
  readonly ADMIN_VITE_SERVER_PORT: string

  /** axios.baseUrl & vite server proxy */
  readonly ADMIN_AXIOS_BASE_URL: string
  readonly ADMIN_VITE_SERVER_PROXY: string

  /** muliple axios.baseUrl & vite server proxy examples: */
  readonly ADMIN_AXIOS_BASE_URL_MULTIPLE_A: string
  readonly ADMIN_VITE_SERVER_PROXY_MULTIPLE_A: string
  readonly ADMIN_AXIOS_BASE_URL_MULTIPLE_B: string
  readonly ADMIN_VITE_SERVER_PROXY_MULTIPLE_B: string
  
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
