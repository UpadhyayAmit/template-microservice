import { StrictMode } from 'react';
import store from './store/index.js';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { msalConfig } from './config/msalConfig.js';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

const msalIntance = new PublicClientApplication(msalConfig);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <MsalProvider instance={msalIntance}>
          <App />
        </MsalProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
