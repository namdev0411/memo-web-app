import React, { useEffect, useState } from 'react';
import { useAuthenticated } from '../auth/hooks/useAuthenticated';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const isAuthehnticated = useAuthenticated();

  useEffect(() => {
    if (isAuthehnticated) {
      window.location.href = '/';
    }
  }, []);

  const handleLogin = () => {
    setLoading(true);

    const clientId = import.meta.env.VITE_SF_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_REDIRECT_URI;
    const loginUrl = import.meta.env.VITE_SALESFORCE_LOGIN_URL;


    if (!clientId || !redirectUri || !loginUrl) {
      console.error('❌ Missing OAuth2 configuration');
      setLoading(false);
      return;
    }

    // Generate state for CSRF protection
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('oauth_state', state);

    // Build OAuth URL - Using Implicit Grant
    const params = new URLSearchParams({
      response_type: 'token', // Implicit Grant - nhận access token trực tiếp
      client_id: clientId,
      redirect_uri: redirectUri,
      state: state,
      scope: 'api' // Minimal scope - just API access
    });

    const authUrl = `${loginUrl}/services/oauth2/authorize?${params.toString()}`;

    console.log('🌐 Redirecting to Salesforce authorization:', authUrl);

    // Redirect to Salesforce
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-white px-4">
      <div className="w-full max-w-md mx-auto flex flex-col justify-center items-center min-h-screen">
        <div className="bg-white/90 shadow-xl rounded-2xl px-8 py-10 flex flex-col items-center border border-gray-100">
          {/* Logo */}
          <div className="mb-6">
            <span className="block text-3xl">📝</span>
          </div>
          {/* Headline */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center tracking-tight">Đăng nhập Memo App</h1>
          <p className="text-gray-500 text-base mb-8 text-center">Quản lý memo thông minh, an toàn với Salesforce</p>
          {/* Login button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-60 mb-6"
          >
            {loading ? 'Đang chuyển hướng...' : 'Đăng nhập với Salesforce'}
          </button>
          {/* Security notice */}
          <div className="w-full text-center mt-2">
            <span className="text-xs text-gray-400">Bảo mật SSL 256-bit • Dữ liệu được mã hóa bởi Salesforce</span>
          </div>
        </div>
        {/* Footer */}
        <div className="text-center mt-8">
          <div className="flex justify-center space-x-3 mb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">React</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Salesforce</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Tailwind CSS</span>
          </div>
          <p className="text-xs text-gray-400">© 2025 Memo App • Phát triển bởi AI Assistant</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
