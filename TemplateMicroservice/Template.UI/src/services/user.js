import { ExecuteAPI } from './base';

export const getUser = async (url, data) => {
  try {
    const response = await ExecuteAPI('/user_management/v1/Users', data, 'Post', false, true);
    return response;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error; // Rethrow the error for further handling if needed
  }
};

export const ModifyUser = async (url, data) => {
  try {
    const response = await ExecuteAPI('/user_management/v1/Users', data, 'Put', false, true);
    return response;
  } catch (error) {
    console.error('Error modifying user data:', error);
    throw error; // Rethrow the error for further handling if needed
  }
};

export const AddUser = async (url, data) => {
  try {
    const response = await ExecuteAPI('/user_management/v1/Users', data, 'Post', false, true);
    return response;
  } catch (error) {
    console.error('Error adding user data:', error);
    throw error; // Rethrow the error for further handling if needed
  }
};
