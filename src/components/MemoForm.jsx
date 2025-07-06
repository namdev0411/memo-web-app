import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const MemoForm = ({ memoId, fromView = false }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (memoId) {
      fetchMemo(memoId);
    }
  }, [memoId]);

  const fetchMemo = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/memo/update/${id}`);

      if (response.data.success) {
        const memo = response.data.data;
        setName(memo.name || '');
        setDescription(memo.description || '');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Không thể tải memo: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !description.trim()) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = { name: name.trim(), description: description.trim() };
      let response;

      if (memoId) {
        // Cập nhật memo existing
        response = await axios.patch(`/api/memo/update/${memoId}`, payload);
      } else {
        // Tạo memo mới
        response = await axios.post('/api/memo/', payload);
      }

      if (response.data.success) {
        // Nếu đến từ trang view, quay lại trang view, nếu không thì về home
        if (fromView && memoId) {
          navigate(`/memo/${memoId}`);
        } else {
          navigate('/');
        }
      } else {
        setError(response.data.message);
      }

    } catch (err) {
      setError('Lỗi khi lưu memo: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (fromView && memoId) {
      navigate(`/memo/${memoId}`);
    } else {
      navigate('/');
    }
  };

  if (loading && memoId) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Đang tải...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {memoId ? 'Chỉnh sửa Memo' : 'Tạo Memo mới'}
        </h1>
        <p className="text-gray-600 mt-1">
          {memoId ? 'Cập nhật thông tin memo của bạn' : ''}
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.08 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề memo <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nhập tiêu đề memo..."
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
              maxLength={255}
            />
            <p className="text-xs text-gray-500 mt-1">
              {name.length}/255 ký tự
            </p>
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung memo <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Nhập nội dung chi tiết memo..."
              rows={8}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-500 resize-none"
              maxLength={5000}
            />
            <p className="text-xs text-gray-500 mt-1">
              {description.length}/5000 ký tự
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Hủy
            </button>

            <button
              type="submit"
              disabled={loading || !name.trim() || !description.trim()}
              className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {memoId ? 'Đang cập nhật...' : 'Đang tạo...'}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {memoId ? 'Cập nhật memo' : 'Tạo memo'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Tips */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm">
            <p className="font-medium text-blue-900 mb-1">💡 Mẹo viết memo hiệu quả:</p>
            <ul className="text-blue-800 space-y-1">
              <li>• Sử dụng tiêu đề ngắn gọn và dễ hiểu</li>
              <li>• Viết nội dung chi tiết để dễ nhớ sau này</li>
              <li>• Có thể sử dụng markdown để định dạng</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoForm;
