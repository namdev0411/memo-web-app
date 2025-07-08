import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getMemoById, deleteMemo } from '../services/memoService';
import { formatTextContent } from '../utils/htmlUtils';
import DOMPurify from 'dompurify';

const ViewMemo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [memo, setMemo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMemo();
    }, [id]);

    const fetchMemo = async () => {
        try {
            setLoading(true);
            console.log('👁️ Loading memo details:', id);

            const response = await getMemoById(id);

            if (response.success) {
                setMemo(response.data);
                console.log('✅ Loaded memo details:', response.data);
            } else {
                setError(response.message);
            }
        } catch (err) {
            console.error('❌ Cannot load memo:', err);
            setError(t('memo.memoError'));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm(t('memo.confirmDelete'))) {
            try {
                const response = await deleteMemo(id);
                if (response.success) {
                    navigate('/');
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
            <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.08 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <h2 className="text-lg font-medium text-red-800 mb-2">{t('errors.notFound')}</h2>
                    <p className="text-red-600 mb-4 text-sm">{error}</p>
                    <Link
                        to="/"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                    >
                        {t('common.back')}
                    </Link>
                </div>
            </div>
        );
    }

    if (!memo) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
                <div className="text-center">
                    <h2 className="text-lg font-medium text-gray-800 mb-2">{t('errors.notFound')}</h2>
                    <Link
                        to="/"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                    >
                        {t('common.back')}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center">
                    <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mr-4">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="hidden sm:inline">{t('common.back')}</span>
                    </Link>
                    <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                            <span className="text-lg">👁️</span>
                        </div>
                        <div>
                            <h1 className="text-lg sm:text-xl font-bold text-gray-900">{t('memo.viewMemo')}</h1>
                            <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">{t('memo.viewMemo')}</p>
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        to={`/memo/${id}/edit`}
                        state={{ from: 'view' }}
                        className="inline-flex items-center justify-center px-4 py-3 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 hover:shadow-lg transition-all duration-200 text-sm min-h-[44px] sm:min-h-[36px]"
                    >
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        {t('common.edit')}
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="inline-flex items-center justify-center px-4 py-3 sm:py-2 border border-red-300 text-red-700 bg-white hover:bg-red-50 hover:border-red-400 rounded-lg transition-colors duration-200 text-sm min-h-[44px] sm:min-h-[36px]"
                    >
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {t('common.delete')}
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Memo header */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 break-words">
                                {memo.name}
                            </h2>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                                <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="hidden sm:inline">{t('memo.createdAt')}: </span>
                                    {new Date(memo.createdDate).toLocaleDateString()}
                                </span>
                                <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span className="hidden sm:inline">{t('memo.lastModified')}: </span>
                                    {new Date(memo.lastModifiedDate).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full font-mono self-start">
                            ID: {memo.id.slice(-8)}
                        </div>
                    </div>
                </div>

                {/* Memo content */}
                <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">{t('memo.content')}</h3>
                    <div className="prose max-w-none">
                        <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
                            <div
                                className="text-gray-800 leading-relaxed text-sm sm:text-base break-words memo-content"
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(formatTextContent(memo.description))
                                }}
                                style={{
                                    lineHeight: '1.6',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Memo stats */}
                <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm">
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
                            <span className="text-gray-600">
                                <strong>{memo.name.length}</strong> {t('memo.title')}
                            </span>
                            <span className="text-gray-600">
                                <strong>{memo.description.length}</strong> {t('memo.content')}
                            </span>
                        </div>
                        <span className="text-gray-500">
                            #{memo.id.slice(-6)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewMemo;
