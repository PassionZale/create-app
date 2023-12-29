import { defineMock } from 'vite-plugin-mock-dev-server'

export default defineMock([
  {
    url: '/api/auth/login',
    method: 'POST',
    delay: 300,
    body: { code: 200, result: 'jwt-mock-data', message: '成功' }
  },

  {
    url: '/api/auth/menus',
    method: 'GET',
    delay: 300,
    body: {
      code: 200,
      message: '成功',
      result: [
        {
          id: '1',
          parentId: '0',
          name: '首页',
          icon: 'HomeOutlined',
          link: '/home',
          children: []
        },
        {
          id: '2',
          parentId: '0',
          name: '页面一',
          icon: 'AppstoreAddOutlined',
          children: [
            {
              id: '2-1',
              parentId: '2',
              name: '子页面1',
              link: '/page1/page-11',
              children: []
            },
            {
              id: '2-2',
              parentId: '2',
              name: '子页面2',
              link: '/page1/page-12',
              children: []
            }
          ]
        }
      ]
    }
  },

  {
    url: '/api/auth/permissions',
    method: 'GET',
    delay: 500,
    body: {
      code: 200,
      message: '成功',
      result: [
        {
          value: 'page-11'
        },
        {
          value: 'page-12'
        }
      ]
    }
  }
])
