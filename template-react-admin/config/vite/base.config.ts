import path from 'node:path'
import fs from 'node:fs'
import { defineConfig } from 'vite'
import lessVarsToJS from 'less-vars-to-js'
import react from '@vitejs/plugin-react'
import { createStyleImportPlugin, AntdResolve } from 'vite-plugin-style-import'

const themeVariables = lessVarsToJS(
  fs.readFileSync(path.resolve(__dirname, '../../src/themes/variables.less'), 'utf-8')
)

export const EnvDir = path.resolve(__dirname, '../envs')

export const EnvPrefix = ['ADMIN']

export const ViteBaseConfig = defineConfig({
  envDir: EnvDir,
  envPrefix: EnvPrefix,

  plugins: [
    react(),
    createStyleImportPlugin({
      resolves: [AntdResolve()]
    })
  ],

  css: {
    preprocessorOptions: {
      less: {
        modifyVars: themeVariables,
        javascriptEnabled: true
      }
    }
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../src'),
      '@@': path.resolve(__dirname, '../../')
    }
  }
})
