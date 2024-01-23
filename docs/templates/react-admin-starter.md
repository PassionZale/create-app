# react-admin-starter

基于 `vite@4` `react@18` `react-router@6` `antd@4` 所构建的管理后台，

使用 `zustand` 存储全局状态，

使用 `react-activation` 实现多页签。

## 脚本说明

```json
"scripts": {
  "start:dev": "运行项目(dev环境)",
  "start:beta": "运行项目(beta环境)",
  "start:uat": "运行项目(uat环境)",
  "start:prod": "运行项目(prod环境)",

  "build:dev": "构建项目(dev环境)",
  "build:beta": "构建项目(beta环境)",
  "build:uat": "构建项目(uat环境)",
  "build:prod": "构建项目(prod环境)",

  "lint": "语法检查",
  "preview": "预览项目"
}
```

## 目录结构

```shell
📂config                   # 配置中心
📂mock                     # 模拟数据
📂public                   # 公共资源
📦src
 ┣ 📂assets                # 静态资源
 ┣ 📂components            # 公共组件
 ┣ 📂pages                 # 页面组件
 ┣ 📂router                # 路由配置
 ┣ 📂store                 # 状态管理
 ┣ 📂themes                # 样式
 ┣ 📂typings               # 类型声明
 ┣ 📂utils                 # 工具模块
 ┣ 📜App.tsx               # 根组件
 ┣ 📜main.tsx              # 入口文件
 ┗ 📜vite-env.d.ts
```

## 技术栈

#### envs

| 名称   | 版本      | 备注                                                      |
| ------ | --------- | --------------------------------------------------------- |
| nodejs | `16.15.0` | [v16.15.0](https://nodejs.org/download/release/v16.15.0/) |

#### deps

| 名称              | 版本      | 备注                                                                                                                       |
| ----------------- | --------- | -------------------------------------------------------------------------------------------------------------------------- |
| react             | `18.*`    | [zh-hans.react.dev](https://zh-hans.react.dev/)                                                                            |
| react-router      | `6.*`     | [reactrouter.com](https://reactrouter.com/en/main)                                                                         |
| zustand           | `latest`  | [文档](https://docs.pmnd.rs/zustand)                                                                                       |
| antd              | `4.24.15` | [官方文档](https://4x.ant.design/index-cn) / [国内镜像](https://4x-ant-design.antgroup.com/index-cn)                       |
| @ant-design/icons | `4.8.1`   | [官方文档](https://4x.ant.design/components/icon-cn/) / [国内镜像](https://4x-ant-design.antgroup.com/components/icon-cn/) |
| react-activation  | `latest`  | [文档](https://github.com/CJY0208/react-activation/blob/HEAD/README_CN.md)                                                 |
| axios             | `1.6.*`   | [文档](https://www.axios-http.cn/docs/intro)                                                                               |

#### devDeps

| 名称                        | 版本     | 备注                                                                                                                           |
| --------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| vite                        | `4.*`    | [官方文档](https://v4.vitejs.dev/) / [中文文档](https://github.com/vitejs/docs-cn/tree/v4.4.9)                                 |
| typescript                  | `5.*`    | N/A                                                                                                                            |
| vite-plugin-mock-dev-server | `latest` | [文档](https://vite-plugin-mock-dev-server.netlify.app/) / [Github](https://github.com/pengzhanbo/vite-plugin-mock-dev-server) |

## alias

```json
{
  "baseUrl": ".",
  "paths": {
    "@/*": ["./src/*"],
    "@@/*": ["./*"]
  }
}
```

## 页签缓存

使用 `react-activate` 来实现多页签的 `<KeepAlive />` 效果，如果你的页面需要缓存，请务必使用 `withKeepAlive` 进行包裹：

```tsx
import React from 'react'
import { withKeepAlive } from '@/components/KeepAlive'

const PageList: React.FC = () => {
  return <div>KeepAlive Page</div>
}

// CacheKey 则需要填写路由的路径
const WrappedComponent = withKeepAlive(
  Page,
  '/basicCenter/systemManage/noticeManage/create'
)

export default WrappedComponent
```

```tsx
import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { withKeepAlive } from '@/components/KeepAlive'
import { uuid } from '@/utils'

const PageDetail: React.FC = () => {
  const [searchParams] = useSearchParams()

  const id = searchParams.get('id')

  useEffect(() => {
    // 详情页被缓存后，通过默写 query 参数来触发是否重新请求数据
    reloadData()
  }, [id])

  return <div>KeepAlive Page</div>
}

// CacheKey 则需要填写路由的路径
const WrappedComponent = withKeepAlive(
  PageDetail,
  '/basicCenter/systemManage/noticeManage/detail'
)

export default WrappedComponent
```

**禁止使用 params 路由声明**

```bash
# 不要这样
/noticeManage/detail/123456

# 要这样
/noticeManage/detail?id=123456
```

## HttpRequest

```ts
import { request } from '@/utils/request'

type RequestDTO = {
  foo: string
}

type ResponseDTO = Menu.MenuOptions[]

// get 请求
await request.get<ResponseDTO>('/auth/menus')
// get 请求 - with query
await request.get<ResponseDTO, RequestDTO>('/auth/menus', {
  params: { foo: 'bar' }
})

// post 请求
await request.post<ResponseDTO, RequestDTO>('/auth/menus', {
  data: { foo: 'bar' }
})

// put 请求
await request.put<ResponseDTO, RequestDTO>('/auth/menus', {
  params: { id: 1 },
  data: { foo: 'bar' }
})

// put 请求 - resultfull
await request.put<ResponseDTO, RequestDTO>(`/auth/menus/${id}`, {
  data: { foo: 'bar' }
})

// delete 请求
await request.delete<ResponseDTO>('/auth/menus', {
  params: { id: 1 }
})

// delete 请求 - resultfull
await request.delete<ResponseDTO>(`/auth/menus/${id}`)

// 自定义请求
await request.request<ResponseDTO, RequestDTO>({
  url: '/auth/menus',
  method: 'POST',
  data: { foo: 'bar' }
})

// 上传
const formData = new FormData()
formData.append('file', file)

await request.upload<string>('/upload', { data: formData })
```
