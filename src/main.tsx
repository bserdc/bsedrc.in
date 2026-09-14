import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Security Filter: Prevent accidental exposure of API keys, URLs, or backend telemetry in client console
if (typeof window !== 'undefined') {
  const sanitize = (args: any[]) =>
    args.map(arg => {
      if (typeof arg === 'string') {
        return arg
          .replace(/AIza[0-9A-Za-z_-]{35}/g, '[REDACTED_KEY]')
          .replace(/key=[0-9A-Za-z_-]+/g, 'key=[REDACTED]');
      }
      return arg;
    });

  const origWarn = console.warn;
  console.warn = (...args: any[]) => {
    try {
      const msg = args.map(a => (typeof a === 'string' ? a : (a?.message || ''))).join(' ');
      if (msg.includes('AIza') || msg.includes('firestore.googleapis') || msg.includes('@firebase') || msg.includes('Firebase:')) {
        return; // Suppress backend SDK internals from leaking
      }
      origWarn.apply(console, sanitize(args));
    } catch {
      // no-op
    }
  };

  const origError = console.error;
  console.error = (...args: any[]) => {
    try {
      const msg = args.map(a => (typeof a === 'string' ? a : (a?.message || ''))).join(' ');
      if (msg.includes('AIza') || msg.includes('firestore.googleapis') || msg.includes('@firebase') || msg.includes('Firebase:')) {
        return; // Suppress backend SDK internals from leaking
      }
      origError.apply(console, sanitize(args));
    } catch {
      // no-op
    }
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
