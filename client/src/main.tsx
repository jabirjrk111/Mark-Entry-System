import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'

console.log("Main.tsx is executing");

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error("Root element not found");

  createRoot(rootElement).render(
    <StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </StrictMode>,
  )
} catch (e) {
  console.error("FATAL ERROR:", e);
  document.body.innerHTML = `<div style="color:red; font-size: 20px; padding: 20px;"><h1>Application Error</h1><pre>${e instanceof Error ? e.message : JSON.stringify(e)}</pre></div>`;
}
