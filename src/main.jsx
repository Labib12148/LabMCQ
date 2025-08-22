import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from '@/App.jsx';
import '@/index.css';
import '@/styles/styles.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

if (rootElement.hasChildNodes()) {
  hydrateRoot(
    rootElement,
    <StrictMode>
      <App />
    </StrictMode>,
  );
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
