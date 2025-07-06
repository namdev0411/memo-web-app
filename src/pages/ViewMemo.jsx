import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const ViewMemo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [memo, setMemo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMemo();
    }, [id]);

    const fetchMemo = async () => {
        try {
            setLoading(true);
            console.log('👁️ Đang tải memo chi tiết:', id);

            const response = await axios.get(`/api/memo/update/${id}`);

            if (response.data.success) {
                setMemo(response.data.data);
                console.log('✅ Loaded memo details:', response.data.data);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            console.error('❌ Không thể tải memo:', err);
            setError('Không thể tải memo. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Bạn có chắc muốn xóa memo này?')) {
            try {
                const response = await axios.delete(`/api/memo/${id}`);
                if (response.data.success) {
                    navigate('/');
                } else {
                    alert('Lỗi: ' + response.data.message);
                }
            } catch (err) {
                alert('Không thể xóa memo: ' + err.message);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Đang tải memo...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-2xl mx-auto px-4 py-12">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.08 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <h2 className="text-lg font-medium text-red-800 mb-2">Không thể tải memo</h2>
                        <p className="text-red-600 mb-4">{error}</p>
                        <Link
                            to="/"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            Quay lại trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!memo) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-2xl mx-auto px-4 py-12">
                    <div className="text-center">
                        <h2 className="text-lg font-medium text-gray-800 mb-2">Không tìm thấy memo</h2>
                        <Link
                            to="/"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            Quay lại trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mr-4">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Quay lại
                            </Link>
                            <div className="flex items-center space-x-3">
                                <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                                    <span className="text-lg">👁️</span>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">Chi tiết Memo</h1>
                                    <p className="text-sm text-gray-500">Xem thông tin memo</p>
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center space-x-3">
                            <Link
                                to={`/memo/${id}/edit`}
                                state={{ from: 'view' }}
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 hover:shadow-lg transition-all duration-200"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Chỉnh sửa
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="inline-flex items-center px-4 py-2 border border-red-300 text-red-700 bg-white hover:bg-red-50 hover:border-red-400 rounded-lg transition-colors duration-200"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Memo header */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-8 py-6 border-b border-gray-200">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {memo.name}
                                </h2>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Tạo: {new Date(memo.createdDate).toLocaleDateString('vi-VN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Cập nhật: {new Date(memo.lastModifiedDate).toLocaleDateString('vi-VN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>
                            <div className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full font-mono">
                                ID: {memo.id.slice(-8)}
                            </div>
                        </div>
                    </div>

                    {/* Memo content */}
                    <div className="px-8 py-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Nội dung</h3>
                        <div className="prose max-w-none">
                            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                    {memo.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Memo stats */}
                    <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-6">
                                <span className="text-gray-600">
                                    <strong>{memo.name.length}</strong> ký tự trong tiêu đề
                                </span>
                                <span className="text-gray-600">
                                    <strong>{memo.description.length}</strong> ký tự trong nội dung
                                </span>
                            </div>
                            <span className="text-gray-500">
                                Memo #{memo.id.slice(-6)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tips */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-sm">
                            <p className="font-medium text-blue-900 mb-1">💡 Bạn có thể:</p>
                            <ul className="text-blue-800 space-y-1">
                                <li>• Nhấn <strong>Chỉnh sửa</strong> để cập nhật nội dung memo</li>
                                <li>• Nhấn <strong>Xóa</strong> để xóa memo này (không thể hoàn tác)</li>
                                <li>• Nhấn <strong>Quay lại</strong> để về danh sách memo</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewMemo;
