import { Outlet } from 'react-router-dom';
import MainNav from '../components/MainNav';
const Layout = () => (
    <>
        <MainNav />
        <Outlet />
    </>
);

export default Layout;
