import { useNavigate } from 'react-router-dom'
import { Button, Result } from 'antd'

const PermissionDenied = () => {
  const navigate = useNavigate()

  return (
    <Result
      status="403"
      title="403"
      subTitle="您没有权限访问此页面"
      extra={
        <Button type="primary" onClick={() => navigate('/', { replace: true })}>
          回到首页
        </Button>
      }
    />
  )
}

export default PermissionDenied
