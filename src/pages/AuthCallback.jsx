import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setTokens } from '../utils/auth.js';

const AuthCallback = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('🔍 URL hiện tại:', window.location.href);
        console.log('📍 Pathname:', window.location.pathname);
        console.log('🔗 Search:', window.location.search);
        console.log('🏷️ Hash:', window.location.hash);

        // Kiểm tra xem có phải callback URL không
        if (!window.location.pathname.includes('/auth/callback')) {
            console.log('⏭️ Không phải callback URL, bỏ qua...');
            setLoading(false);
            return;
        }

        // Với Implicit Grant, token sẽ ở URL fragment (#)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const urlParams = new URLSearchParams(window.location.search);

        const accessToken = hashParams.get('access_token');
        const state = hashParams.get('state') || urlParams.get('state');
        const errorParam = hashParams.get('error') || urlParams.get('error');
        const errorDesc = hashParams.get('error_description') || urlParams.get('error_description');

        console.log('🔑 Access token từ URL:', accessToken ? 'Có' : 'Không có');
        console.log('🎯 State:', state);

        if (errorParam) {
            console.error('❌ Lỗi từ Salesforce:', errorParam, errorDesc);
            setError(`${errorParam}: ${errorDesc}`);
            setLoading(false);
            return;
        }

        if (!accessToken) {
            console.error('❌ Không tìm thấy access_token trong URL');
            setError('Không nhận được access token từ Salesforce. Vui lòng thử lại.');
            setLoading(false);
            return;
        }

        // Kiểm tra state chống CSRF
        const localState = localStorage.getItem('oauth_state');
        if (state !== localState) {
            console.error('❌ State không khớp:', { state, localState });
            setError('Mã state không hợp lệ. Vui lòng thử lại.');
            setLoading(false);
            return;
        }

        // Lưu token sử dụng hàm dùng chung
        console.log('✅ Lưu access token...');

        // Lấy thêm thông tin từ URL fragment nếu có
        const instanceUrl = hashParams.get('instance_url');
        const refreshToken = hashParams.get('refresh_token');
        const scope = hashParams.get('scope');

        // Sử dụng hàm setTokens để lưu thông tin
        const decodedInstanceUrl = instanceUrl ? decodeURIComponent(instanceUrl) : null;
        const expiresIn = 2 * 60 * 60; // 2 giờ cho Implicit Grant

        setTokens(accessToken, decodedInstanceUrl, refreshToken, expiresIn);

        if (scope) {
            localStorage.setItem('salesforce_scope', decodeURIComponent(scope));
        }

        localStorage.removeItem('oauth_state'); // Dọn dẹp

        console.log('🎉 Xác thực thành công với Implicit Grant!');
        console.log('📊 Stored data:', {
            access_token: '✅ Stored',
            instance_url: decodedInstanceUrl || '❌ None',
            refresh_token: refreshToken ? '✅ Stored' : '❌ None'
        });

        setLoading(false);
        navigate('/');
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-white px-4">
            <div className="max-w-md w-full bg-white/90 shadow-xl rounded-2xl px-8 py-10 flex flex-col items-center border border-gray-100">
                <h2 className="text-2xl font-bold mb-4 text-center">Đang xác thực với Salesforce...</h2>
                {loading && <p className="text-blue-600">Vui lòng chờ...</p>}
                {error && <div className="text-red-600 text-center mt-4">{error}</div>}
            </div>
        </div>
    );
};

export default AuthCallback;
