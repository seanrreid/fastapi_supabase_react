
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import MainNav from '../components/MainNav';

const ProtectedRouteLayout = () => {
    const { isAuth } = useAuth();

    // Check if the user is authenticated
    if (!isAuth) {
        // If not authenticated, redirect to the login page
        return <Navigate to='/login' />;
    }

    // If authenticated, render the child routes
    return (
        <>
            <MainNav />
            <Outlet />
        </>
    );
};

export default ProtectedRouteLayout;