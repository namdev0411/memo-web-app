

import { Outlet } from "react-router";
import { useTranslation } from 'react-i18next';
import { useAuthenticated } from './auth/hooks/useAuthenticated';
import { useLogout } from './auth/hooks/useLogout';
import LanguageSelector from './components/LanguageSelector';

const Layout = () => {
    const isAuthenticated = useAuthenticated();
    const { logout } = useLogout();
    const { t } = useTranslation();

    const handleLogout = () => {
        console.log('👋 Logging out...');
        logout();
    };

    // Nếu chưa check xong authentication, hiển thị loading
    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="flex flex-col items-center space-y-4 p-8 bg-white rounded-xl shadow-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600 font-medium">{t('auth.authenticating')}</span>
                </div>
            </div>
        );
    }

    // Nếu chưa xác thực, redirect về login
    if (!isAuthenticated) {
        console.log("User is not authenticated, redirecting to login");
        window.location.href = '/login';
        return null;
    }

    return (
        <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
            {/* Fixed Header */}
            <header className="flex-shrink-0 bg-white shadow-sm border-b border-gray-200 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo/Title */}
                        <div className="flex items-center">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                                {t('memo.memos')}
                            </h1>
                        </div>

                        {/* Right side - Logout & Language Selector */}
                        <div className="flex items-center space-x-3 sm:space-x-4">
                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 md:px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors duration-200 min-h-[40px]"
                                title={t('common.logout')}
                            >
                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="hidden sm:inline">{t('common.logout')}</span>
                            </button>

                            {/* Language Selector */}
                            <LanguageSelector />
                        </div>
                    </div>
                </div>
            </header>

            {/* Scrollable Main Content */}
            <main className="flex-1 overflow-y-auto bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default Layout;