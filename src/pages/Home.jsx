import MemoList from '../components/MemoList';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

const Home = () => {
  const { t } = useTranslation();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('memo.memos')}</h2>
          <p className="text-gray-600 text-sm sm:text-base mt-1">{t('memo.manageMemos')}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex gap-3">
            {/* Refresh button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex-1 sm:flex-initial min-h-[44px]"
              title={t('common.refresh')}
            >
              <svg
                className={`w-4 h-4 flex-shrink-0 ${isRefreshing ? 'animate-spin' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline text-sm">{isRefreshing ? t('common.loading') : t('common.refresh')}</span>
            </button>

            {/* Add new memo button */}
            <Link
              to="/memo/new"
              className="inline-flex items-center justify-center space-x-1 sm:space-x-2 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 no-underline cursor-pointer border border-blue-400/20 flex-1 sm:flex-initial min-h-[44px]"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm sm:text-base">{t('memo.addNewMemo')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Memo List */}
      <MemoList key={refreshTrigger} />
    </div>
  );
};

export default Home;
