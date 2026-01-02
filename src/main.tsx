import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/reset.css'
import './style/common.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
