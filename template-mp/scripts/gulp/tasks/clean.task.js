const del = require('del')
const { args } = require('../context')

module.exports = async () => {
  await del([`${args.output}/**`], { force: true, dot: true })
}
