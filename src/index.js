import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

import './App.css';

document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');

  createRoot(rootElement).render(
    <Router>
      <App />
    </Router>
  );
});