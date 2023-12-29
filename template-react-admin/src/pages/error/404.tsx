import { useNavigate } from 'react-router-dom'
import { Button, Result } from 'antd'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <Result
      status="404"
      title="404"
      subTitle="您访问的页面不存在"
      extra={
        <Button type="primary" onClick={() => navigate('/', { replace: true })}>
          回到首页
        </Button>
      }
    />
  )
}

export default NotFound
