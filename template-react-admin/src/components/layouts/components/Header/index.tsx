import { Layout } from 'antd'
import LayoutTabs from '@/components/layouts/components/Tabs'
import Profile from './components/Profile'

import styles from './index.module.less'

const LayoutHeader = () => {
  return (
    <Layout.Header className={styles.header}>
      <div className={styles.tabs}>
        <LayoutTabs />
      </div>

      <Profile />
    </Layout.Header>
  )
}

export default LayoutHeader
