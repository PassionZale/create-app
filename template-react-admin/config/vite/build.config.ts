import { defineConfig, mergeConfig } from 'vite'
import { ViteBaseConfig } from './base.config'

export default defineConfig(() => {
  return mergeConfig(ViteBaseConfig, {
    build: { chunkSizeWarningLimit: 1600 }
  })
})
