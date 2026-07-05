import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { SelectedMonthProvider } from './shared/context';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SelectedMonthProvider>
      <App />
    </SelectedMonthProvider>
  </StrictMode>,
);
