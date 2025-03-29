import { ExecuteAPI } from './base';

export const getRole = async (url, data) => {
  try {
    const response = await ExecuteAPI('/user_management/v1/Roles', data, 'Post', false, true);
    return response;
  } catch (error) {
    console.error('Error fetching role data:', error);
    throw error; // Rethrow the error for further handling if needed
  }
};

export const AddRole = async (url, data) => {
  try {
    const response = await ExecuteAPI('/user_management/v1/Roles', data, 'Post', false, true);
    return response;
  } catch (error) {
    console.error('Error adding role data:', error);
    throw error; // Rethrow the error for further handling if needed
  }
};

export const UpdateRole = async (url, data) => {
  try {
    const response = await ExecuteAPI('/user_management/v1/Roles', data, 'Put', false, true);
    return response;
  } catch (error) {
    console.error('Error updating role data:', error);
    throw error; // Rethrow the error for further handling if needed
  }
};
