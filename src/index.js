import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';

import { BrowserRouter, Routes, Route, } from 'react-router-dom';

import { AuthProvider } from './context/AuthProvider'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);
