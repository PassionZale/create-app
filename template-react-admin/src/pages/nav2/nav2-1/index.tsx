import { Input } from 'antd'

const Page = () => {
  return (
    <div>
      <h2>列表3</h2>
      <Input style={{ width: 300 }} placeholder="不会缓存，切换 tab 后重置" />
    </div>
  )
}

export default Page
