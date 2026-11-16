import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';
import { capturePrefill } from './shared/prefill';

// Avant tout rendu : la connexion GitHub renvoie à la racine et perdrait les paramètres.
capturePrefill();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
