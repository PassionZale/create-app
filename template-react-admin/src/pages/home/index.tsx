import { Input } from 'antd'
import { withKeepAlive } from '@/components/KeepAlive'

const Home = () => {
  return (
    <div>
      <h2>首页</h2>
      <Input style={{ width: 300 }} placeholder="输入任意内容，切换 tab，输入框值不变" />
    </div>
  )
}

const WrappedComponent = withKeepAlive(Home, '/home')

export default WrappedComponent
