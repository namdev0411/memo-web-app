import React, { useState } from 'react';
import { testConnection as testConnectionService } from '../services/memoService';
import { getAccessToken, getInstanceUrl } from '../utils/auth.js';

const TestConnection = () => {
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const accessToken = getAccessToken();
      const instanceUrl = getInstanceUrl();

      console.log('🧪 Test connection với:', {
        hasToken: !!accessToken,
        instanceUrl,
        tokenPrefix: accessToken ? accessToken.substring(0, 20) + '...' : 'N/A'
      });

      // Test với API endpoint memo
      const response = await testConnectionService();

      setTestResult({
        success: true,
        message: 'Kết nối thành công!',
        data: response,
        status: 200
      });

    } catch (error) {
      console.error('❌ Test connection failed:', error);

      setTestResult({
        success: false,
        message: 'Kết nối thất bại',
        error: error.response?.data || error.message,
        status: error.response?.status
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Test Kết nối Salesforce</h3>
        <button
          onClick={testConnection}
          disabled={testing}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {testing ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Đang test...</span>
            </div>
          ) : (
            'Test Connection'
          )}
        </button>
      </div>

      {testResult && (
        <div className={`rounded-lg p-4 ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center mb-2">
            {testResult.success ? (
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className={`font-medium ${testResult.success ? 'text-green-700' : 'text-red-700'}`}>
              {testResult.message}
            </span>
            {testResult.status && (
              <span className="ml-2 text-sm text-gray-500">(Status: {testResult.status})</span>
            )}
          </div>

          <pre className="text-xs bg-gray-100 p-3 rounded mt-2 overflow-auto">
            {JSON.stringify(testResult.success ? testResult.data : testResult.error, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p>🔍 Test này sẽ gọi API <code>/api/memo</code> để kiểm tra:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Access token có hợp lệ không</li>
          <li>Instance URL có đúng không</li>
          <li>Apex REST API có hoạt động không</li>
          <li>Quyền truy cập Memo__c object</li>
        </ul>
      </div>
    </div>
  );
};

export default TestConnection;
