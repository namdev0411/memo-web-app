

import { Outlet } from "react-router";
import { useAuthenticated } from './auth/hooks/useAuthenticated';

const Layout = () => {
    const isAuthenticated = useAuthenticated();

    // Nếu chưa check xong authentication, hiển thị loading
    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Đang kiểm tra xác thực...</span>
            </div>
        );
    }

    // Nếu chưa xác thực, redirect về login
    if (!isAuthenticated) {
        console.log("User is not authenticated, redirecting to login");
        window.location.href = '/login';
        return null;
    }

    return (
        <div>
            <Outlet />
        </div>
    );
}

export default Layout;