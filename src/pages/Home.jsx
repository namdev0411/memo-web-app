import MemoList from '../components/MemoList';
import { Link } from 'react-router-dom';
import { useLogout } from '../auth/hooks/useLogout';
import { useState } from 'react';

const Home = () => {
  const { logout } = useLogout();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleLogout = () => {
    console.log('👋 Đăng xuất...');
    logout();
  };

  const handleRefresh = () => {
    console.log('🔄 Refreshing memo list...');
    setIsRefreshing(true);
    setRefreshTrigger(prev => prev + 1);
    
    // Reset loading state sau 1 giây
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                <span className="text-xl">📝</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Memo App</h1>
                <p className="text-sm text-gray-500">Quản lý memo thông minh</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Danh sách Memo</h2>
              <p className="text-gray-600 mt-1">Quản lý và tổ chức các memo của bạn</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                title="Tải lại danh sách memo"
              >
                <svg 
                  className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{isRefreshing ? 'Đang tải...' : 'Tải lại'}</span>
              </button>
              <Link
                to="/memo/new"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 no-underline cursor-pointer border border-blue-400/20"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Thêm Memo mới</span>
              </Link>
            </div>
          </div>
        </div>

        <MemoList key={refreshTrigger} />
      </div>
    </div>
  );
};

export default Home;
