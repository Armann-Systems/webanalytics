import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AuthService from './api/services/AuthService';

// Initialize auth interceptors with navigation
function InitializeAuth() {
  const navigate = useNavigate();
  React.useEffect(() => {
    AuthService.initializeInterceptors(navigate);
  }, [navigate]);
  return null;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <InitializeAuth />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
