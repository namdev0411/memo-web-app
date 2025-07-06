import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import MemoForm from '../components/MemoForm';

const EditMemo = () => {
  const { id } = useParams();
  const location = useLocation();
  const fromView = location.state?.from === 'view';
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link 
              to={fromView ? `/memo/${id}` : "/"} 
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mr-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {fromView ? 'Quay lại xem chi tiết' : 'Quay lại'}
            </Link>
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                <span className="text-lg">✏️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Chỉnh sửa Memo</h1>
                <p className="text-sm text-gray-500">Cập nhật thông tin memo</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MemoForm memoId={id} fromView={fromView} />
      </div>
    </div>
  );
};

export default EditMemo;
