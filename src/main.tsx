import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './hooks/useAuth.ts';
import { CommerceProvider } from './hooks/useCommerce.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CommerceProvider>
        <App />
      </CommerceProvider>
    </AuthProvider>
  </StrictMode>
);
