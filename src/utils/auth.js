/**
 * Hàm tiện ích để xử lý authentication và token management
 */

/**
 * Xóa tất cả tokens Salesforce khỏi localStorage
 * Sử dụng chung cho logout và error handling khi token expired
 */
export const clearSalesforceTokens = () => {
    console.log('🗑️ Clearing Salesforce tokens from localStorage');

    // Xóa tất cả tokens và thông tin liên quan
    localStorage.removeItem('salesforce_access_token');
    localStorage.removeItem('salesforce_instance_url');
    localStorage.removeItem('salesforce_refresh_token');
    localStorage.removeItem('salesforce_token_expires_at');

    console.log('✅ Salesforce tokens cleared successfully');
};

/**
 * Kiểm tra xem user có đang được authenticated không
 */
export const isAuthenticated = () => {
    const accessToken = localStorage.getItem('salesforce_access_token');
    const expiresAt = localStorage.getItem('salesforce_token_expires_at');

    if (!accessToken || !expiresAt) {
        return false;
    }

    // Kiểm tra xem token có còn hạn không
    const now = new Date().getTime();
    const expireTime = parseInt(expiresAt);

    return now < expireTime;
};

/**
 * Lấy access token hiện tại
 */
export const getAccessToken = () => {
    return localStorage.getItem('salesforce_access_token');
};

/**
 * Lấy instance URL hiện tại
 */
export const getInstanceUrl = () => {
    return localStorage.getItem('salesforce_instance_url');
};

/**
 * Lưu tokens vào localStorage
 */
export const setTokens = (accessToken, instanceUrl, refreshToken, expiresIn) => {
    console.log('💾 Saving Salesforce tokens to localStorage');

    localStorage.setItem('salesforce_access_token', accessToken);
    localStorage.setItem('salesforce_instance_url', instanceUrl);

    if (refreshToken) {
        localStorage.setItem('salesforce_refresh_token', refreshToken);
    }

    if (expiresIn) {
        // Tính thời gian hết hạn (hiện tại + expiresIn seconds)
        const expiresAt = new Date().getTime() + (expiresIn * 1000);
        localStorage.setItem('salesforce_token_expires_at', expiresAt.toString());
    }

    console.log('✅ Salesforce tokens saved successfully');
};
