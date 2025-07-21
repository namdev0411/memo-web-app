import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MemoForm from '../components/MemoForm';
import { createMemo } from '../services/memoService';

const NewMemo = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (memoData) => {
    setLoading(true);
    try {
      const response = await createMemo({
        ...memoData,
        actionDateTime: memoData.actionDateTime,
      });

      if (response.success) {
        console.log('✅ Memo created successfully:', response.data);
        navigate('/');
      } else {
        console.error('❌ Failed to create memo:', response.message);
        alert(t('memo.memoError') + ': ' + response.message);
      }
    } catch (error) {
      console.error('❌ Error creating memo:', error);
      alert(t('memo.memoError') + ': ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('memo.newMemo')}</h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1">{t('memo.addNewMemo')}</p>
        </div>

        <button
          onClick={handleCancel}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>{t('common.back')}</span>
        </button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6">
          <MemoForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default NewMemo;
