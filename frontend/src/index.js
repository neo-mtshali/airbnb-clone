import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

// Create a cache instance
const cache = createCache({
  key: 'css',
  prepend: true,
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CacheProvider value={cache}>
      <App />
    </CacheProvider>
  </React.StrictMode>
);
