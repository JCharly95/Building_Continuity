import React from 'react';
import ReactDOM from 'react-dom/client';
import Bomba from './Grafica_Sensores/BombLine'
import Auth from './Login/Autenticacion/Auth'
import Login from './Login/Login'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  {
    /*
    <Bomba />
    */
  }
  <Auth />
  </React.StrictMode>
);