import React from 'react'
import LayoutIndex from '@/components/layouts/LayoutIndex'
import { RouterObject } from '@/router/interface'
import lazyLoad from '@/router/utils/lazyLoad'

const nav2Router: RouterObject[] = [
  {
    element: <LayoutIndex />,
    meta: { title: '导航2' },
    children: [
      {
        path: '/nav2/nav2-1',
        element: lazyLoad(React.lazy(() => import('@/pages/nav2/nav2-1'))),
        meta: {
          title: '列表3'
        }
      },
      {
        path: '/nav2/nav2-2',
        element: lazyLoad(React.lazy(() => import('@/pages/nav2/nav2-2'))),
        meta: {
          title: '列表4'
        }
      }
    ]
  }
]

export default nav2Router
