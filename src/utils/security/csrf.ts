
export const generateCSRFToken = () => {
  const token = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
  localStorage.setItem('csrf_token', token);
  return token;
};

export const validateCSRFToken = (token: string) => {
  const storedToken = localStorage.getItem('csrf_token');
  if (!storedToken || token !== storedToken) {
    throw new Error('Invalid CSRF token');
  }
  // Generate new token after validation
  generateCSRFToken();
};
