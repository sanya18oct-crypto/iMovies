const apiUrl = import.meta.env.VITE_API_URL;
const apiHost = import.meta.env.VITE_API_HOST;

export const render = (
  apiUrl || (apiHost ? `https://${apiHost}/api` : 'http://localhost:5001/api')
).replace(/\/$/, '');
