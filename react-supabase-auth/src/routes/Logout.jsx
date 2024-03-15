import { useEffect } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export async function loader() {
    const url = 'http://localhost:8000/logout/';
    const access_token = localStorage.getItem('access_token');

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
        },
    });
    const statusCode = response.status;
    return statusCode === 200 ? true : false;
}

const Logout = () => {
    const response = useLoaderData();
    const navigate = useNavigate();
    const { setIsAuth } = useAuth();

    let logged_in = true;

    if (response) {
        localStorage.clear();
        logged_in = false;
    } else {
        alert('PROBLEM LOGGING OUT');
    }

    useEffect(() => {
        setIsAuth(logged_in);
        return navigate(`/login`);
    }, [setIsAuth, logged_in, response, navigate]);
};

export default Logout;
