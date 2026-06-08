import React from 'react';
import ReactDOM from 'react-dom/client';
import RootApp from './RootApp';
import './bootstrap';

import '../css/app.css';
import '../css/globals.css';
import '../css/index.css';

const container = document.getElementById('app');

if (!container) {
  throw new Error('Root container #app not found');
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>
);
