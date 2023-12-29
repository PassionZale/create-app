import { Layout } from 'antd'
import pkg from '@@/package.json'

const LayoutFooter = () => {
  return (
    <Layout.Footer style={{ textAlign: 'center', padding: '10px 0 20px 0' }}>
      Copyright &copy; {import.meta.env.ADMIN_APP_NAME} v{pkg.version}
    </Layout.Footer>
  )
}

export default LayoutFooter
