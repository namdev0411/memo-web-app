import { useNavigate } from 'react-router-dom';
export const useLogout = () => {
    const navigate = useNavigate();
    const logout = () => {
        // Xóa access token và refresh token khỏi localStorage
        localStorage.removeItem('salesforce_access_token');
        localStorage.removeItem('salesforce_instance_url');
        localStorage.removeItem('salesforce_refresh_token');
        localStorage.removeItem('salesforce_token_expires_at');

        // Chuyển hướng về trang đăng nhập
        navigate('/login');
    };

    return { logout };
}