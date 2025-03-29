import { ExecuteAPI } from '../base';
import { generateQueryString } from '../../shared/common';

try {
    export const getFeature = async (pageIndex, pageSize, filterForm) => {
    const queryString = generateQueryString({
      pageIndex: pageIndex,
      pageSize: pageSize,
      ...filterForm,
    });

    const response = await ExecuteAPI(`/user_management/v1/Features${queryString}`, {}, 'Get', false, true);
    return response;
  } catch (error) {
    console.error('Error fetching feature data:', error);
    throw error; // Rethrow the error for further handling if needed
  }
};

export const addFeature = async (data) => {
  try {
    const response = await ExecuteAPI('/user_management/v1/Features', data, 'Post', false, true);
    return response;
  } catch (error) {
    console.error('Error adding feature:', error);
    throw error; // Rethrow the error for further handling if needed
  }
};

export const updateFeature = async (data) => {
  try {
    const response = await ExecuteAPI('/user_management/v1/Features', data, 'Put', false, true);
    return response;
  } catch (error) {
    console.error('Error updating feature:', error);
    throw error; // Rethrow the error for further handling if needed
  }
};

