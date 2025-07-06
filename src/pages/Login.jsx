import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthenticated } from '../auth/hooks/useAuthenticated';
import LanguageSelector from '../components/LanguageSelector';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const isAuthehnticated = useAuthenticated();
  const { t } = useTranslation();

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-white px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md mx-auto flex flex-col justify-center items-center min-h-screen py-8">
        {/* Language selector - positioned at top right */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
          <LanguageSelector />
        </div>

        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl px-6 sm:px-8 py-8 sm:py-10 flex flex-col items-center border border-gray-100 w-full">
          {/* Logo */}
          <div className="mb-6">
            <span className="block text-4xl sm:text-5xl">📝</span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center tracking-tight">
            {t('memo.memos')} App
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mb-8 text-center px-2">
            {t('auth.loginRequired')}
          </p>

          {/* Login button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 sm:py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base sm:text-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-60 disabled:cursor-not-allowed mb-6 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('auth.redirecting')}
              </span>
            ) : (
              t('auth.loginWithSalesforce')
            )}
          </button>

          {/* Security notice */}
          <div className="w-full text-center mt-2">
            <div className="flex items-center justify-center text-xs text-gray-400 space-x-2">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>SSL 256-bit • Salesforce Security</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8 w-full">
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">React</span>
            <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Salesforce</span>
            <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Tailwind CSS</span>
          </div>
          <p className="text-xs text-gray-400 px-4">© 2025 Memo App • AI Assistant</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
