import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Result } from 'antd'

const InternalError = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const subTitle = location.state?.message || '服务器发生异常'

  return (
    <Result
      status="500"
      title="500"
      subTitle={subTitle}
      extra={
        <Button type="primary" onClick={() => navigate('/', { replace: true })}>
          回到首页
        </Button>
      }
    />
  )
}

export default InternalError
