import axios from 'axios';

// Tạo instance với cấu hình động
const instance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor để thêm access token và sử dụng instance_url động
instance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('salesforce_access_token');
    const instanceUrl = localStorage.getItem('salesforce_instance_url');
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    // Sử dụng instance_url động thay vì baseURL cố định
    if (instanceUrl && !config.url.startsWith('http')) {
      config.baseURL = `${instanceUrl}/services/apexrest`;
      console.log('🌐 Sử dụng instance_url:', config.baseURL);
    } else if (!config.baseURL && !config.url.startsWith('http')) {
      // Fallback về env nếu không có instance_url
      config.baseURL = import.meta.env.VITE_SALESFORCE_API_BASE_URL;
      console.log('🔄 Fallback về baseURL:', config.baseURL);
    }
    
    console.log('📤 Request config:', {
      url: config.url,
      baseURL: config.baseURL,
      headers: {
        ...config.headers,
        Authorization: config.headers.Authorization ? 'Bearer [TOKEN]' : undefined
      }
    });
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Interceptor để handle response errors
instance.interceptors.response.use(
  (response) => {
    console.log('✅ Response success:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ Response error:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      console.warn('🔐 Token expired hoặc không hợp lệ, redirect to login');
    //   localStorage.removeItem('salesforce_access_token');
    //   localStorage.removeItem('salesforce_instance_url');
    //   localStorage.removeItem('salesforce_refresh_token');
    //   localStorage.removeItem('salesforce_token_expires_at');
    //   window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
