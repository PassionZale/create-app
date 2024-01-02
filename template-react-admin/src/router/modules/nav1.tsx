import React from 'react'
import LayoutIndex from '@/components/layouts/LayoutIndex'
import { RouterObject } from '@/router/interface'
import lazyLoad from '@/router/utils/lazyLoad'

const nav1Router: RouterObject[] = [
  {
    element: <LayoutIndex />,
    meta: { title: '导航1' },
    children: [
      {
        path: '/nav1/nav1-1',
        element: lazyLoad(React.lazy(() => import('@/pages/nav1/nav1-1'))),
        meta: {
          title: '列表1'
        }
      },
      {
        path: '/nav1/nav1-1/create',
        element: lazyLoad(React.lazy(() => import('@/pages/nav1/nav1-1/create'))),
        meta: {
          title: '列表1新增'
        }
      },
      {
        path: '/nav1/nav1-1/detail',
        element: lazyLoad(React.lazy(() => import('@/pages/nav1/nav1-1/detail'))),
        meta: {
          title: '列表1编辑'
        }
      },
      {
        path: '/nav1/nav1-2',
        element: lazyLoad(React.lazy(() => import('@/pages/nav1/nav1-2'))),
        meta: {
          title: '列表2'
        }
      }
    ]
  }
]

export default nav1Router
