import axios from 'axios';
import { loginRequest, msalInstance } from '../config/msalConfig';
import store from '../store';

const envURL = getEnvObj();
const baseAPIURL = envURL.baseAPIURL;
const baseUserkey = envURL.baseUserkey;

axios.default.baseUrl = baseAPIURL;
axios.default.headers.common['Content-Type'] = 'application/json';
axios.default.headers.common['Access-Control-Allow-Origin'] = '*';

const getIdToken = async () => {
  const account = msalInstance.getAllAccounts()[0];
  if (!account) {
    throw new Error('No account found');
  }

  const request = {
    ...loginRequest,
    account: account,
  };

  try {
    await msalInstance.initialize();
    const response = await msalInstance.acquireTokenSilent(request);
    return response.idToken.rawIdToken;
  } catch (error) {
    console.error('Error acquiring token silently:', error);
    window.localtion.href = '/session-expired';
    store.dispatch('logoutUser');
    throw error;
  }
};

async function createConfig(useKey) {
  const accessToken = await getIdToken();
  let authDetails = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Contrl': 'no-cache',
    },
  };
  if (useKey) {
    authDetails.headers[baseUserkey] = useKey;
  }
  return authDetails;
}

export function _formatError(error) {
  if (error?.response?.data && error.code) {
    return {
      message: error.response.data.error.message,
      type: error.code,
      status: error.response.status,
    };
  }
}

export async function ExecuteAPI(url, data, requestType, skiptoast, skipSuccessToast) {
  try {
    const config = await createConfig(url.useKey);

    let responseData = {};

    if (requestType === 'GET') {
      responseData = await axios.get(url, config);
    } else if (requestType === 'POST') {
      responseData = await axios.post(url, data, config);
    } else if (requestType === 'PUT') {
      responseData = await axios.put(url, data, config);
    } else if (requestType === 'DELETE') {
      responseData = await axios.delete(url, { data, ...config });
    } else if (requestType === 'PATCH') {
      responseData = await axios.patch(url, data, config);
    }
    return responseData.data;
  } catch (error) {
    console.error('Error executing API:', error);

    if (error.response.status === 401) {
      window.localtion.href = '/session-expired';
      store.dispatch('logoutUser');
    }

    if (error.response) {
      return _formatError(error);
    } else {
      return {
        message: 'Network Error',
        type: 'NetworkError',
        status: 500,
      };
    }
  }
}
