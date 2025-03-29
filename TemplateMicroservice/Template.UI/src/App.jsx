import { useState } from 'react';
import './App.css';
import { EventType } from '@azure/msal-browser';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useRoutes } from 'react-router-dom';
import { loginRequest } from './config/msalConfig';
import routes from './shared/utils/routes';
import { setAuth, setUserName } from './store/reducers/auth';

function AppRouters() {
  const elements = useRoutes(routes);
  return elements;
}

const App = () => {
  const isAuthenticate = useIsAuthenticated();
  const { instance } = useMsal();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticate) {
      const activeAcount = instance.getActiveAccount();
      if (activeAcount) {
        dispatch(setAuth(activeAcount));
      }
    }
  }, [isAuthenticate]);

  instance.addEventCallback(
    (event) => {
      if (event.eventType == EventType.LOGIN_SUCCESS && event.payload.account) {
        const account = event.payload.account;
        instance.setActiveAccount(account);
      }
    },
    (error) => {}
  );

  instance.handleRedirectPromise().then(async (authResult) => {
    const account = instance.getActiveAccount();
    if (!account) {
      await instance.loginRedirect(loginRequest);
    }
  });

  const handleIdle = () => {
    navigate('/session-expired');
  };

  return (
    <Box>
      <AppRouters />
      <IdleTimeout timeout={1800000} onIdle={handleIdle} />
    </Box>
  );
};

export default App;
