import { defineConfig, mergeConfig, loadEnv } from 'vite'
import vitePluginMockDevServer from 'vite-plugin-mock-dev-server'
import { EnvDir, EnvPrefix, ViteBaseConfig } from './base.config'

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, EnvDir, EnvPrefix) }

  return mergeConfig(ViteBaseConfig, {
    plugins: [vitePluginMockDevServer()],
    server: {
      host: true,
      port: parseInt(process.env.ADMIN_VITE_SERVER_PORT!),
      proxy: {
        [`^${process.env.ADMIN_VITE_SERVER_PROXY}`]: {
          target: process.env.ADMIN_AXIOS_BASE_URL,
          changeOrigin: true,
          secure: true,
          rewrite: (path: string) => {
            console.log('original =>', path)

            const rewrite = path.replace(`${process.env.ADMIN_VITE_SERVER_PROXY}`, '')

            console.log('rewrite => ', `${process.env.ADMIN_AXIOS_BASE_URL}${rewrite}`)

            return rewrite
          }
        },
        [`^${process.env.ADMIN_VITE_SERVER_PROXY_MULTIPLE_A}`]: {
          target: process.env.ADMIN_AXIOS_BASE_URL_MULTIPLE_A,
          changeOrigin: true,
          secure: true,
          rewrite: (path: string) =>
            path.replace(`${process.env.ADMIN_VITE_SERVER_PROXY_MULTIPLE_A}`, '')
        },
        [`^${process.env.ADMIN_VITE_SERVER_PROXY_MULTIPLE_B}`]: {
          target: process.env.ADMIN_AXIOS_BASE_URL_MULTIPLE_B,
          changeOrigin: true,
          secure: true,
          rewrite: (path: string) =>
            path.replace(`${process.env.ADMIN_VITE_SERVER_PROXY_MULTIPLE_B}`, '')
        },
      }
    }
  })
})
