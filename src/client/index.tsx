import { createRoot } from 'react-dom/client'

import Router from './Router'

import './styles/index.css'

const node = document.getElementById('root')!
const root = createRoot(node)

root.render(<Router />)
