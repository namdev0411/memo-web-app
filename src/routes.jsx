import { createBrowserRouter } from "react-router-dom";
import Login from './pages/Login';
import Home from './pages/Home';
import NewMemo from './pages/NewMemo';
import EditMemo from './pages/EditMemo';
import ViewMemo from './pages/ViewMemo';
import AuthCallback from './pages/AuthCallback';
import Layout from './Layout';

export const routers = createBrowserRouter([
    {
        path: "/login",
        Component: Login,
    },
    {
        path: "/auth/callback",
        Component: AuthCallback,
    },
    {
        path: "/",
        Component: Layout,
        children: [
            { index: true, Component: Home },
            {
                path: "memo",
                children: [
                    { index: true, Component: Home },
                    {
                        path: "new",
                        Component: NewMemo
                    },
                    {
                        path: ":id",
                        Component: ViewMemo,
                    },
                    {
                        path: ":id/edit",
                        Component: EditMemo,
                    }
                ]
            },
        ],
    }
]);
