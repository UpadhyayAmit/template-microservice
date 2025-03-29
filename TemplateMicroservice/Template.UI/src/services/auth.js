import { ExecuteAPI } from './base';

export const fetchUserRole = async (url, data, requestType) => {
  try {
    const response = await ExecuteAPI(url, data, requestType);
    return response;
  } catch (error) {
    console.error('Error fetching user role:', error);
    throw error; // Rethrow the error for further handling if needed
  }
};
