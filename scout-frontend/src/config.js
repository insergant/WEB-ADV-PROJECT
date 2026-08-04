// Single source of truth for the backend URL.
// Override at build time with REACT_APP_API_URL (e.g. in scout-frontend/.env),
// otherwise defaults to the local dev server.
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default API_BASE_URL;
