import { defineMock } from 'vite-plugin-mock-dev-server'

export default defineMock([
  {
    url: '/api/auth/login',
    method: 'POST',
    body: { code: 200, result: 'jwt-mock-data', message: '成功' }
  },

])
