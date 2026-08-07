import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { FarmsProvider } from './contexts/FarmsContext'
import { CurrentFarmProvider } from './contexts/CurrentFarmContext'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <FarmsProvider>
        <CurrentFarmProvider>
          <App />
          <Toaster position="top-right" toastOptions={{ className: 'bg-slate-900 text-slate-100' }} />
        </CurrentFarmProvider>
      </FarmsProvider>
    </AuthProvider>
  </StrictMode>,
)
