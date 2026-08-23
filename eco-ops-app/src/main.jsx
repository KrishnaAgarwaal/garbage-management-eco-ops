import React from 'react';
import ReactDOM from 'react-dom/client';

// Import Bootstrap CSS first, then our overrides
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)