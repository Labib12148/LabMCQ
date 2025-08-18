import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from '@/App.jsx';
import { PUBLISHER_ID } from '@/config/adsense';
import '@/index.css';

const script = document.createElement('script');
script.async = true;
script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${PUBLISHER_ID}`;
script.crossOrigin = 'anonymous';
document.head.appendChild(script);

const meta = document.createElement('meta');
meta.name = 'google-adsense-account';
meta.content = `ca-${PUBLISHER_ID}`;
document.head.appendChild(meta);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);
