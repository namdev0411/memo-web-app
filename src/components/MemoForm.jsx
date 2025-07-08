import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { stripHtml } from '../utils/htmlUtils';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const MemoForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
  isEdit = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || ''
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation - check if content has actual text (not just HTML tags)
    const plainTextContent = stripHtml(formData.description).trim();
    if (!formData.name.trim() || !plainTextContent) {
      setError(t('memo.titleRequired') + ' & ' + t('memo.descriptionRequired'));
      return;
    }

    // Check character limit
    if (plainTextContent.length > 5000) {
      setError(t('memo.contentTooLong'));
      return;
    }

    const submitData = {
      name: formData.name.trim(),
      description: formData.description.trim()
    };

    try {
      await onSubmit(submitData);
    } catch (err) {
      setError(err.message || t('memo.memoError'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.08 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-red-700 font-medium text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Title Field */}
      <div>
        <label htmlFor="memo-title" className="block text-sm font-medium text-gray-700 mb-2">
          {t('memo.title')} <span className="text-red-500">*</span>
        </label>
        <input
          id="memo-title"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder={`${t('memo.title')}...`}
          required
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-gray-900 placeholder-gray-500 text-sm sm:text-base"
          maxLength={255}
          disabled={loading}
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.name.length}/255
        </p>
      </div>

      {/* Description Field */}
      <div>
        <label htmlFor="memo-description" className="block text-sm font-medium text-gray-700 mb-2">
          {t('memo.content')} <span className="text-red-500">*</span>
        </label>

        <div className="quill-editor">
          <ReactQuill
            value={formData.description}
            onChange={(content) => handleChange('description', content)}
            readOnly={loading}
            theme="snow"
            placeholder={`${t('memo.content')}...`}
            modules={{
              toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['link'],
                ['clean']
              ]
            }}
            formats={[
              'header', 'bold', 'italic', 'underline', 'strike',
              'list', 'bullet', 'align', 'link'
            ]}
          />
        </div>

        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">
            {t('memo.richTextSupported')}
          </p>
          <p className="text-xs text-gray-500">
            {stripHtml(formData.description).length} / 5000 {t('memo.charactersNoHTML')}
          </p>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="inline-flex items-center justify-center px-4 py-3 sm:py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] sm:min-h-[40px]"
        >
          <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t('common.cancel')}
        </button>

        <button
          type="submit"
          disabled={loading || !formData.name.trim() || !stripHtml(formData.description).trim()}
          className="inline-flex items-center justify-center px-5 sm:px-6 py-3 sm:py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md text-sm sm:text-base min-h-[44px] sm:min-h-[40px]"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('common.loading')}
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {isEdit ? t('memo.saveMemo') : t('memo.newMemo')}
            </>
          )}
        </button>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm">
            <p className="font-medium text-blue-900 mb-1">💡 {t('memo.memos')} tips:</p>
            <ul className="text-blue-800 space-y-1 text-xs sm:text-sm">
              <li>• {t('memo.titleRequired')}</li>
              <li>• {t('memo.contentRequired')}</li>
              <li>• {t('memo.richTextSupported')}</li>
              <li>• {t('memo.useToolbarFormatting')}</li>
            </ul>
          </div>
        </div>
      </div>
    </form>
  );
};

export default MemoForm;
