import { ExecuteAPI } from "./base";

export const getMasterData = async (url, data, requestType) => {
  try {
    const response = await ExecuteAPI(url, data, requestType);
    return response;
  } catch (error) {
    console.error("Error fetching master data:", error);
    throw error; // Rethrow the error for further handling if needed
  }
}