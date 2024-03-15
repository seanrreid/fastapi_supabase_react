import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Layout from '../pages/Layout';
import ProtectedRouteLayout from '../pages/ProtectedRouteLayout';
import Error from '../pages/Error';
import Home, { loader as homeLoader } from './Home';
import Login, { action as loginAction } from './Login';
import Logout, { loader as logoutLoader } from './Logout';
import Protected from './Protected';

const Routes = () => {
    const { isAuth } = useAuth();

    const publicRoutes = [
        {
            element: <Layout />,
            errorElement: <Error />,
            children: [
                {
                    path: '/',
                    element: <Home />,
                    loader: homeLoader
                },
                {
                    path: '/login',
                    element: <Login />,
                    action: loginAction,
                },
                {
                    path: '/logout',
                    element: <Logout />,
                    loader: logoutLoader,
                },
            ],
        },
    ];

    const protectedRoutes = [
        {
            element: <ProtectedRouteLayout />,
            children: [
                {
                    path: '/protected',
                    element: <Protected />,
                }
            ],
        },
    ];

    const router = createBrowserRouter([
        ...publicRoutes,
        ...(!isAuth ? protectedRoutes : []),
        ...protectedRoutes,
    ]);

    return <RouterProvider router={router} />;
};

export default Routes;
