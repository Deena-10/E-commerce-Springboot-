import { jwtDecode } from 'jwt-decode';

export function getUserRole() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.role || decoded.roles?.[0] || null; // adapt this based on your JWT structure
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
}
