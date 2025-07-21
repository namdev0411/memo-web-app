import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getAllMemos, deleteMemo } from '../services/memoService';
import { truncateHtml } from '../utils/htmlUtils';

const MemoList = () => {
  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    fetchMemos();
  }, []);

  const fetchMemos = async () => {
    try {
      setLoading(true);
      const response = await getAllMemos();

      if (response.success) {
        setMemos(response.data || []);
        console.log('✅ Loaded memos:', response.data?.length || 0);
      } else {
        console.error('❌ API error:', response.message);
        setError(response.message);
      }
    } catch (err) {
      console.error('❌ Cannot load memo list:', err);
      setError(t('memo.memoError'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('memo.confirmDelete'))) {
      try {
        const response = await deleteMemo(id);
        if (response.success) {
          setMemos(memos.filter(m => m.id !== id));
        } else {
          alert(t('errors.somethingWentWrong') + ': ' + response.message);
        }
      } catch (err) {
        alert(t('memo.memoError') + ': ' + err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 sm:py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">{t('common.loading')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center mx-4 sm:mx-0">
        <div className="flex items-center justify-center mb-2">
          <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.08 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span className="text-red-700 font-medium">{t('errors.somethingWentWrong')}</span>
        </div>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (memos.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <div className="mx-auto h-16 w-16 sm:h-24 sm:w-24 text-gray-300 mb-4">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{t('memo.noMemos')}</h3>
        <p className="text-gray-500 mb-4 text-sm sm:text-base">{t('memo.addNewMemo')}</p>
        <Link
          to="/memo/new"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 no-underline"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>{t('memo.newMemo')}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-4 sm:p-0">
      {memos.map(memo => {
        if (memo.lastModifiedDate) {
          const d = new Date(memo.lastModifiedDate);
          const pad = n => n.toString().padStart(2, '0');
          memo.lastModifiedDate = `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}`;
        }

        return (
          <div key={memo.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-3">
                <h3
                  className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors flex-1 mr-2"
                  onClick={() => navigate(`/memo/${memo.id}`)}
                >
                  {memo.name}
                </h3>
                <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
                  <button
                    onClick={() => navigate(`/memo/${memo.id}/edit`)}
                    className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 min-w-[32px] min-h-[32px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center"
                    title={t('common.edit')}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(memo.id)}
                    className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 min-w-[32px] min-h-[32px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center"
                    title={t('common.delete')}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <p
                className="text-gray-600 text-sm line-clamp-3 mb-4 cursor-pointer hover:text-gray-800 transition-colors"
                onClick={() => navigate(`/memo/${memo.id}`)}
              >
                {truncateHtml(memo.description, 100)}
              </p>

              <div className="flex flex-col gap-1 text-xs text-gray-400">
                {memo.actionDateTimeFormatted && (
                  <span className="flex items-center font-medium">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="hidden sm:inline">{t('memo.actionDateTime')}:</span>
                    <span>{memo.actionDateTimeFormatted}</span>
                  </span>
                )}
                <span className="flex items-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="hidden sm:inline">{t('memo.lastModified')}: </span>
                  {memo.lastModifiedDate}
                </span>
              </div>
            </div>

            {/* Card footer */}
            <div className="bg-gray-50 px-4 sm:px-6 py-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">
                  ID: #{memo.id.slice(-6)}
                </span>
                <button
                  onClick={() => navigate(`/memo/${memo.id}`)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                >
                  {t('common.view')} →
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MemoList;
