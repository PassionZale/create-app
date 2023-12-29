import ReactDOM from 'react-dom'
import { autoFixContext } from 'react-activation'
import jsxRuntime from 'react/jsx-runtime'
import jsxDevRuntime from 'react/jsx-dev-runtime'
import App from './App.tsx'
import '@/themes/common.less'

autoFixContext(
  [jsxRuntime, 'jsx', 'jsxs', 'jsxDEV'],
  [jsxDevRuntime, 'jsx', 'jsxs', 'jsxDEV']
)

ReactDOM.render(<App />, document.getElementById('root'))
