import { useEffect } from 'react';
import { useAuth } from '../AuthContext';

const Protected = () => {
    const { refreshSession } = useAuth();

    useEffect(() => {
        refreshSession()
    }, [refreshSession])

    return (
        <>
            <h1>Protected Route</h1>
            <p>You should only see this if you are logged in.</p>
        </>
    );
};

export default Protected;