import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MemoForm from '../components/MemoForm';
import { getMemoById, updateMemo } from '../services/memoService';

const EditMemo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [loadingMemo, setLoadingMemo] = useState(true);

  const fromView = location.state?.from === 'view';

  useEffect(() => {
    fetchMemo();
  }, [id]);

  const fetchMemo = async () => {
    try {
      setLoadingMemo(true);
      const response = await getMemoById(id);

      if (response.success) {
        setInitialData(response.data);
      } else {
        console.error('❌ Failed to fetch memo:', response.message);
        alert(t('memo.memoError') + ': ' + response.message);
        navigate('/');
      }
    } catch (error) {
      console.error('❌ Error fetching memo:', error);
      alert(t('memo.memoError') + ': ' + error.message);
      navigate('/');
    } finally {
      setLoadingMemo(false);
    }
  };

  const handleSubmit = async (memoData) => {
    setLoading(true);
    try {
      const response = await updateMemo(id, memoData);

      if (response.success) {
        console.log('✅ Memo updated successfully:', response.data);

        // Nếu đến từ trang view, quay lại trang view, nếu không thì về home
        if (fromView) {
          navigate(`/memo/${id}`);
        } else {
          navigate('/');
        }
      } else {
        console.error('❌ Failed to update memo:', response.message);
        alert(t('memo.memoError') + ': ' + response.message);
      }
    } catch (error) {
      console.error('❌ Error updating memo:', error);
      alert(t('memo.memoError') + ': ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (fromView) {
      navigate(`/memo/${id}`);
    } else {
      navigate('/');
    }
  };

  if (loadingMemo) {
    return (
      <div className="flex items-center justify-center py-8 sm:py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">{t('common.loading')}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('memo.editMemo')}</h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1">
            {fromView ? t('memo.editMemo') : t('memo.editMemo')}
          </p>
        </div>

        <button
          onClick={handleCancel}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>{fromView ? t('memo.viewMemo') : t('common.back')}</span>
        </button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6">
          <MemoForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
            isEdit={true}
          />
        </div>
      </div>
    </div>
  );
};

export default EditMemo;
