// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Asegúrate de que este archivo exista para estilos generales
import App from './App';
import { AuthProvider } from './context/AuthContext'; // Importa AuthProvider
import { BrowserRouter } from 'react-router-dom'; // Importa BrowserRouter

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* Envuelve la aplicación con BrowserRouter aquí */}
      <AuthProvider> {/* Y AuthProvider dentro del Router */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
