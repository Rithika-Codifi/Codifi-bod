import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/app/App';
import { PwaUpdater } from '@/app/pwa/PwaUpdater';
import '@/styles/globals.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');

createRoot(root).render(
  <StrictMode>
    <App />
    <PwaUpdater />
  </StrictMode>,
);
