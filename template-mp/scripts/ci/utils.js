const glob = require('glob')
const path = require('path')
const { execSync } = require('child_process')

// 根据仓库地址解析仓库名称
// http://gitlab.lzstack.com/saas/saas-admin/frontend/mps/official-mp.git
// =>
// official-mp
function getRepoName(repo) {
  const arr = repo.split('/')

  return arr[arr.length - 1].replace('.git', '')
}

// 获取 zip 文件名称
function getBuildName(src) {
  const files = glob.sync('**/*.zip', {
    cwd: src,
    root: path.join(src, '/'),
    ignore: [
      '**/node_modules/**',
      '**/.git/**',
      '**/.vscode/**',
      '**/dist/**',
      '**/build/**',
      '**/release/**',
      '**/src/**'
    ]
  })

  return files[0]
}

const runExec = (command, options) =>
  new Promise((resolve, reject) => {
    try {
      const result = execSync(command, {
        stdio: 'inherit',
        cwd: process.cwd(),
        ...options
      })

      resolve(result)
    } catch (error) {
      reject(error)
    }
  })

const getPackageName = name => {
  if (name === '__FULL__') {
    return '整包'
  } else if (name === '__APP__') {
    return '主包'
  } else {
    return '分包'
  }
}

const getFormatFileSize = bytes => {
  if (bytes === 0) {
    return {
      size: 0,
      measure: 'Bytes'
    }
  }

  bytes *= 1024

  const K = 1024
  const MEASURE = ['', 'Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(K))

  return {
    size: parseFloat((bytes / Math.pow(K, i)).toFixed(2)),
    measure: MEASURE[i]
  }
}

module.exports = {
  getRepoName,
  getBuildName,
  runExec,
  getPackageName,
  getFormatFileSize
}
