import React from 'react'
import lazyLoad from '@/router/utils/lazyLoad'
import { RouterObject } from '@/router/interface'

// 错误页面模块
const errorRouter: RouterObject[] = [
  {
    path: '/403',
    element: lazyLoad(React.lazy(() => import('@/pages/error/403'))),
    meta: {
      title: '403页面'
    }
  },
  {
    path: '/404',
    element: lazyLoad(React.lazy(() => import('@/pages/error/404'))),
    meta: {
      title: '404页面'
    }
  },
  {
    path: '/500',
    element: lazyLoad(React.lazy(() => import('@/pages/error/500'))),
    meta: {
      title: '500页面'
    }
  }
]

export default errorRouter
