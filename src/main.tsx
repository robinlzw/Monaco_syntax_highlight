import React from 'react'
import ReactDOM from 'react-dom/client'
import MonacoEditor from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MonacoEditor />
  </React.StrictMode>,
)
