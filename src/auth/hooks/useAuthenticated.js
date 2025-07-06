import { useState, useEffect } from 'react';

export const useAuthenticated = () => {
    // Khởi tạo với null để phân biệt "chưa check" vs "đã check"
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        console.log('🔑 Kiểm tra trạng thái xác thực...');

        // Kiểm tra xem người dùng đã đăng nhập hay chưa
        const token = localStorage.getItem('salesforce_access_token');
        const expiresAt = localStorage.getItem('salesforce_token_expires_at');

        console.log('🔑 Kiểm tra access token:', token ? 'Có' : 'Không có');

        if (token) {
            // Kiểm tra token có hết hạn không
            if (expiresAt && Date.now() > parseInt(expiresAt)) {
                console.log('⏰ Token đã hết hạn');
                localStorage.removeItem('salesforce_access_token');
                localStorage.removeItem('salesforce_instance_url');
                localStorage.removeItem('salesforce_refresh_token');
                localStorage.removeItem('salesforce_token_expires_at');
                setIsAuthenticated(false);
            } else {
                setIsAuthenticated(true);
            }
        } else {
            setIsAuthenticated(false);
        }
    }, []); // Chỉ chạy 1 lần khi component mount

    // Trả về null nếu chưa check xong, để tránh flash
    return isAuthenticated;
};