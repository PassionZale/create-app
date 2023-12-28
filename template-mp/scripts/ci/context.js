const path = require('path')
const { homedir } = require('os')
const yargs = require('yargs/yargs')
const args = yargs(yargs.hideBin(process.argv)).argv

const { REPO_DOWNLOAD_FOLDER, ENV_BRANCH_MAPS } = require('./constants')
const { getRepoName } = require('./utils')

const { env } = args
const branch = ENV_BRANCH_MAPS[env]
const repo = process.env.npm_config_repo
const repoName = getRepoName(repo)
const repoPath = path.join(homedir(), REPO_DOWNLOAD_FOLDER, repoName, branch)
const workspace = path.join(repoPath, `./build`)

const cloneCommand = `git clone ${repo} ${repoPath} && cd ${repoPath} && git checkout ${branch}`
const installCommand = `cd ${repoPath} && npm install --only=production`
const buildCommand = `cd ${repoPath} && gulp build --env=${env} --output=./build --ignoreLocal`

module.exports = {
  env,
  branch,
  repo,
  repoName,
  repoPath,
  workspace,
  cloneCommand,
  installCommand,
  buildCommand
}
