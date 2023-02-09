import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { AccountContextProvider } from './context/AccountContext';


const container = ReactDOM.createRoot(document.getElementById('root'));
container.render(
 <React.StrictMode>
    <AccountContextProvider>
      <BrowserRouter>
         <App />
      </BrowserRouter>
   </AccountContextProvider>
 </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
