import { useNavigate } from 'react-router-dom';
import { clearSalesforceTokens } from '../../utils/auth.js';

export const useLogout = () => {
    const navigate = useNavigate();

    const logout = () => {
        // Sử dụng hàm dùng chung để xóa tokens
        clearSalesforceTokens();

        // Chuyển hướng về trang đăng nhập
        navigate('/login');
    };

    return { logout };
};