import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'swiper/css';
import App from './App.tsx';

function BootstrapInit() {
  useEffect(() => {
    void import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);
  return null;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BootstrapInit />
    <App />
  </StrictMode>,
);
