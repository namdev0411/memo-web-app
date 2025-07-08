import { useState, useEffect } from 'react';
import { isAuthenticated as checkAuth, clearSalesforceTokens } from '../../utils/auth.js';

export const useAuthenticated = () => {
    // Khởi tạo với null để phân biệt "chưa check" vs "đã check"
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        console.log('🔑 Kiểm tra trạng thái xác thực...');

        // Sử dụng hàm dùng chung để kiểm tra authentication
        const authenticated = checkAuth();

        if (!authenticated) {
            // Nếu token hết hạn hoặc không có, clear tất cả tokens
            clearSalesforceTokens();
            setIsAuthenticated(false);
        } else {
            setIsAuthenticated(true);
        }
    }, []); // Chỉ chạy 1 lần khi component mount

    // Trả về null nếu chưa check xong, để tránh flash
    return isAuthenticated;
};