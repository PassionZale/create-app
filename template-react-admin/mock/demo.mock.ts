import { defineMock } from 'vite-plugin-mock-dev-server'

const records = [
  {
    id: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号'
  },
  {
    id: '2',
    name: '吴彦祖',
    age: 42,
    address: '西湖区湖底公园1号'
  }
]

export default defineMock([
  {
    url: '/api/nav/list',
    method: 'GET',
    delay: 300,
    body: {
      code: 200,
      message: '成功',
      result: records
    }
  },
  {
    url: '/api/nav/detail',
    method: 'POST',
    delay: 300,
    body(request) {
      const id = request.body.id

      return {
        code: 200,
        message: '成功',
        result: records.find(item => item.id === id)
      }
    }
  }
])
