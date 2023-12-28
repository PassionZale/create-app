import { version, name } from '../../../package.json'

export const nav = [
  {
    text: '指南',
    activeMatch: '^/guide/',
    link: '/guide/introduction'
  },
  {
    text: '模板',
    activeMatch: '^/templates/',
    link: '/templates/mp-starter'
  },
  {
    text: `v${version}`,
    link: `https://www.npmjs.com/package/${name}?activeTab=versions`
  }
]
