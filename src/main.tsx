import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Design system: tokens primeiro, classes depois, CSS local por último.
import './styles/tokens.css';
import './styles/enfaci.css';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
