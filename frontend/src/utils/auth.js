// utils/auth.js
export const isAuthenticated = () => {
  return !!localStorage.getItem('token'); // atau 'user', tergantung implementasi
};
