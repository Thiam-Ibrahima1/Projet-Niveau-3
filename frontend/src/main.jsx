import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Récupère l'élément racine dans le DOM
const root = document.getElementById('root');

// Vérifie si l'élément existe avant de rendre l'application
if (!root) {
  console.error(' ERREUR: Le div #root n\'existe pas dans index.html');
} else {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}