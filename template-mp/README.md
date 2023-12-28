# mp-starter

基于 Javascript 的小程序项目模板

更多详细的介绍可参考：[微信小程序](https://www.lovchun.com/tags/miniprogram)

## 项目初始化

### .npmrc

在 `.npmrc` 中，填充 `repo` ，即仓库地址，例如：https://https://github.com/PassionZale/mp-generator-templates.git

### env

在 `.env` 文件中，填充各个环境的 `APPID` 和 `API_BASEPATH`

- APPID: 当前环境所使用的小程序 APPID;
- API_BASEPATH: 当前环境服务端 host 前缀，例如：https://dev-api.exp.com/api/v1;

## 项目规范

### VSCode Plugin

| 插件名称                    |              必须安装               | 说明                            |
| ----------------------- | :-----------------------------: | -------------------------------- |
| ESLint        | `是` | 提供全局的语法检查           |
| stylelint | `是`  | 提供 .scss .wxss 样式文件检查 |
| Prettier   |   `是`   | 提供统一的全局代码格式化    |
| wxml   |   `是`   | 提供 jsx 风格的代码格式化    |
| 微信小程序开发助手(minapp 修改版)   |   `是`   | 提供 wxml 的语法高亮    |
| wechat-snippet   |   否   | 小程序代码片段    |

### Husky Hooks

项目中预制了 `husky hooks`，会结合 `prettier` `eslint` `commitlint`:

- 在每次保存文件时，进行格式化;
- 在每次提交时，进行修复;

### 提交规范

**在 `git add` 后，建议使用 `npm run commit` 进行 message 填写**

```json
[
  { "value": "wip",         "name" : "wip:               开发中" },
  { "value": "update",      "name" : "update:            功能改动" },
  { "value": "feat",        "name" : "feat:              新增功能" },
  { "value": "del",         "name" : "del:               功能或者文件删除" },
  { "value": "perf",        "name" : "perf:              性能, 体验优化" },
  { "value": "fix",         "name" : "fix:               修复 Bug" },
  { "value": "format",      "name" : "format:            格式化代码，不影响功能，例如空格、代码格式等" },
  { "value": "config",      "name" : "config:            修改或添加配置文件" },
  { "value": "refactor",    "name" : "refactor:          重构代码(既没有新增功能，也没有修复 bug)" },
  { "value": "doc",         "name" : "doc:               文档更新" },
  { "value": "test",        "name" : "test:              新增测试用例或是更新现有测试" },
  { "value": "revert",      "name" : "revert:            回退版本" },
  { "value": "build",       "name" : "build:             修改项目构建系统(例如 glup 的配置等)的提交" },
  { "value": "chore",       "name" : "chore:             杂务，不属于以上类型，例如run build、引入或更新软件包等" },
]
```

### ENV

根目录下, 有四份 `dotenv` 文件，`start` `build` `preview` `upload` 四套脚本，都会根据当前指定的 `env`，动态读取环境变量注入到上下文中。

支持**本地环境变量**，在根目录创建 `.env.local`，相同的配置项，会使用 `local` 进行覆盖。

```shell
APPID=小程序APPID
API_BASEPATH=接口调用域名
API_ALIAS_ENABLED=true or false(生产必须为false)
```

### 分支说明

#### master

主分支, `protected`, 对应生产环境, 一旦你需要改代码, **必须**从主分支 `checkout` 新分支, 不允许通过其他方式创建新分支.

#### pre-release

预发布分支, 对应预发布环境.

#### test

测试分支, 对应测试环境.

#### dev

开发分支, 对应开发环境.

#### 新分支

> **永远以 `master` 创建新分支**

| 场景                    |              模板               | 示例                             |
| ----------------------- | :-----------------------------: | -------------------------------- |
| 新的迭代或者功能        | `feature-${content}-${YYYMMDD}` | feature-运费模板-20220330            |
| 交互级的轻微 Bug 热修复 | `hotfix-${content}-${YYYMMDD}`  | hotfix-下单错误文案优化-20220330 |
| 工单级的重要 Bug 修复   |   `fix-${content}-${YYYMMDD}`   | fix-配送方式逻辑优化-20220330    |

### 工作流

#### 联调

将 `feature-branch` **Merge In To** `dev branch`

```shell
feature-运费模板-20220330 --------> dev
                        merge in to
```

构建小程序代码包

```shell
npm run build:dev
```

#### 送测

将 `feature-branch` **Merge In To** `test branch`

```shell
feature-运费模板-20220330 --------> test
                        merge in to
```

构建小程序代码包

```shell
npm run build:sit
```

#### 预发布

将 `feature-branch` **Merge In To** `pre-release branch`

```shell
feature-运费模板-20220330 --------> pre-release
                        merge in to
```

构建小程序代码包

```shell
npm run build:uat
```

#### 主分支

创建一个 `feature-branch` **Merge In To** `master branch` 的 `merge request`.

并指定合并者, 申请合并代码.

```shell
feature-运费模板-20220330 --------> master
                  create merge request
```

更新版本号

```shell
git checkout master
git pull
npm version major | minor | patch
git push
```

以当前 `version` 创建 `tag`, 并完善标签描述.

构建小程序代码包

```shell
npm run build:prod
```

## 目录结构(待完善)

```bash
- scripts/

- src/
    _shared/     共享模块
      images/
      components/
      helpers/
      configs/
      vendors/
      styles/

    home/     主包首页
      images/
      components/
      pages/
        index/
          index.js
          index.wxml
          index.scss
          index.json
    otherSubPackage/ 其他分包
```

## 项目开发

### 安装依赖

```bash
#Windows
npm install

# MacOS
sudo npm install --unsafe-perm=true --allow-root
```

### 运行项目

- 运行 `npm run start:${env}`

- 将 **根目录** 导入开发者工具, 注意 **不是导入 dist/** 目录

`npm run start` 默认为 `dev` 环境

`npm run start:dev`

`npm run start:sit`

`npm run start:uat`

`npm run start:prod`

### 打包项目

> 打包项目时，将以对应环境分支进行打包，不会使用你的本地代码
>
> 当你需要打包时，请将你的分支**合并进环境分支后**，再进行打包

`npm run build:dev`

`npm run build:sit`

`npm run build:uat`

`npm run build:prod`

### 预览项目

> 预览项目时，将以对应环境分支进行打包，不会使用你的本地代码
>
> 当你需要打包时，请将你的分支**合并进环境分支后**，再进行打包

`npm run preview:dev`

`npm run preview:sit`

`npm run preview:uat`

`npm run preview:prod`

### 上传项目

> 上传项目时，将以对应环境分支进行打包，不会使用你的本地代码
>
> 当你需要打包时，请将你的分支**合并进环境分支后**，再进行打包
>
> 如果是发布生产环境，**请务必修改版本号并打好 tag**

`npm run upload:dev`

`npm run upload:sit`

`npm run upload:uat`

`npm run upload:prod`

## Generator

### 创建组件

```bash
# 在 _shared 中创建组件
npm run make -- --c=myComponent

# 在 home(主包) 中创建组件
npm run make -- --c=myComponent --s=home

# 在 分包 中创建组件
npm run make -- --c=myComponent --s=customer/subPackage
```

### 创建页面

```bash
# 在 home(主包) 中创建页面
npm run make -- --p=myPage --s=home

# --s=home 可以缺省，不指定 system ，默认会将页面创建至 home 主包中：
npm run make -- --p=myPage

# 在 分包 中创建组件
npm run make -- --p=myPage --s=customer/subPackage
```

### 参数说明

| 参数 | 缩写 | 含义 | 默认值 | 是否必填 |
| --- | :---: | :---: | :---: | :--- |
| page | p | 页面名称（组件所在的文件夹与文件名同名）| 无 | 是 |
| component | c |  组件名称（组件所在的文件夹与文件名同名）| 无 | 是 |
| system | s | 主包或分包名称 | 无 | 否 |

### 注意事项

- 创建主包的页面或分包的页面时，会自动在 `app.json` 中更新 `pages` 和 `subPackages`

## Alias

>'@' => './src/**/*'

### *.js

```js
import userHelper from '@/_shared/helper/user'
```

### *.wxs

```js
const userHelper = require('@/_shared/helper/user')
```

### *.scss & *.wxss

```css
@import "@/_shared/styles/flex.scss";
```

### *.wxml

```html
<import src="@/common/test.wxml" />
<image src="@/_shared/images/test.png" />
```

## Request

```js
import request from '@/_shared/configs/helper/request'
import { useRequest } from '@/_shared/configs/helper/request'

Page({
  async loadData1() {
    const [error, res] = await useRequest('user/info', { foo: 'bar' })

    if(error) {
      // error.message
    }
  }

  async loadData2() {
    try {
      const { data } = await request('user/info', { foo: 'bar' })
    } catch (error) {
      // error.message
    }
  }
})
```
