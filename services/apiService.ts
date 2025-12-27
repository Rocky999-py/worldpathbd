
// Detection for environment-specific API routing
const getApiBase = () => {
  // If we are on localhost but NOT on the backend port, we need to point to the backend
  if (typeof window !== 'undefined') {
    const { hostname, port } = window.location;
    
    // Check if hosted on a common dev port (like Vite 5173)
    if (hostname === 'localhost' && port !== '5000') {
      return 'http://localhost:5000/api';
    }
    
    // Production or same-port serving
    return '/api';
  }
  
  // Fallback for non-browser environments if any
  return 'http://localhost:5000/api';
};

const API_BASE = getApiBase();

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('worldpath_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    
    // Auto-logout on session expiration
    if (response.status === 401 || response.status === 403) {
      const isAuthRoute = endpoint.includes('/auth/') || endpoint.includes('/admin/login');
      if (!isAuthRoute) {
        localStorage.removeItem('worldpath_token');
        localStorage.removeItem('worldpath_session');
        // Simple redirect to auth
        if (typeof window !== 'undefined') {
          window.location.hash = '/auth';
        }
      }
    }

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Network request failed');
    return data;
  } catch (err: any) {
    console.error(`API Error [${endpoint}]:`, err.message);
    throw err;
  }
};
