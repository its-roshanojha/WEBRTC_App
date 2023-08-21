import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App';
import { SocketProvider } from './context/SocketProvider';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
   <SocketProvider>
        <App />
      </SocketProvider> 
  </BrowserRouter>
);


