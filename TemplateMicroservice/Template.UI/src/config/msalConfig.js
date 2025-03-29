import { PublicClientApplication } from '@azure/msal-browser';

 // authConfig.js
export const msalConfig = {
  auth: {
    clientId: 'your_client_id',
    authority: 'https://login.microsoftonline.com/consumers', // For Azure AD consumer accounts
    redirectUri: '/',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (logLevel, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (logLevel) {
          case logLevel.Error:
            console.error(message);
            return;
          case logLevel.Info:
            console.info(message);
            return;
          case logLevel.Verbose:
            console.debug(message);
            return;
          case logLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      },
      piiLoggingEnabled: false,
    },
  },
};

export const loginRequest = {
  scopes: ['openid', 'profile', 'User.Read', 'offline_access', 'Mail.Read'],
};

export const msalInstance = new PublicClientApplication(msalConfig);
