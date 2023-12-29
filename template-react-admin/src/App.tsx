import { BrowserRouter } from 'react-router-dom'
import { AliveScope } from 'react-activation'
import { ConfigProvider } from 'antd'
import Router from '@/router'
import zhCN from 'antd/es/locale/zh_CN'
import 'moment/dist/locale/zh-cn'

const App = () => {
  return (
    <BrowserRouter>
      <AliveScope>
        <ConfigProvider locale={zhCN}>
          <Router />
        </ConfigProvider>
      </AliveScope>
    </BrowserRouter>
  )
}

export default App
