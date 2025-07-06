import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const MemoList = () => {
  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMemos();
  }, []);

  const fetchMemos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/memo');

      if (response.data.success) {
        setMemos(response.data.data || []);
        console.log('✅ Loaded memos:', response.data.data?.length || 0);
      } else {
        console.error('❌ API error:', response.data.message);
        setError(response.data.message);
      }
    } catch (err) {
      console.error('❌ Không thể tải danh sách memo:', err);
      setError('Không thể tải danh sách memo. Vui lòng kiểm tra kết nối và thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa memo này?')) {
      try {
        const response = await axios.delete(`/api/memo/${id}`);
        if (response.data.success) {
          setMemos(memos.filter(m => m.id !== id));
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
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Đang tải...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center mb-2">
          <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.08 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span className="text-red-700 font-medium">Có lỗi xảy ra</span>
        </div>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (memos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có memo nào</h3>
        <p className="text-gray-500 mb-4">Bắt đầu tạo memo đầu tiên của bạn</p>
        <Link to="/new">
          <button className="btn-primary">
            Tạo memo đầu tiên
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {memos.map(memo => (
        <div key={memo.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors flex-1"
                onClick={() => navigate(`/memo/${memo.id}`)}>
                {memo.name}
              </h3>
              <div className="flex space-x-1 ml-2">
                <button
                  onClick={() => navigate(`/memo/${memo.id}/edit`)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  title="Sửa memo"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(memo.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  title="Xóa memo"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-sm line-clamp-3 mb-4 cursor-pointer hover:text-gray-800 transition-colors"
              onClick={() => navigate(`/memo/${memo.id}`)}>
              {memo.description}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Cập nhật: {new Date(memo.lastModifiedDate).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>

          {/* Card footer */}
          <div className="bg-gray-50 px-6 py-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">
                Memo #{memo.id.slice(-6)}
              </span>
              <button
                onClick={() => navigate(`/memo/${memo.id}`)}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Xem chi tiết →
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MemoList;
