export const generateQueryString = (params) => {
  const queryString = Object.keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== null && params[key] !== '' && params[key].length !== 0)
    .map((key) => {
      if (Array.isArray(params[key])) {
        return params[key].map((item) => `${encodeURIComponent(key)}=${encodeURIComponent(item)}`).join('&');
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
    })
    .join('&');
  return queryString ? `?${queryString}` : '';
};
