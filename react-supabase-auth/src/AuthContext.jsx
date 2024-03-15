import PropTypes from 'prop-types';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('access_token')) {
            setIsAuth(true);
        } else {
            setIsAuth(false);
        }
    }, []);

    // We'll be able to call this just in case our access token has expired
    // If the expiration is fine, then it just passes on...
    const refreshSession = async () => {
        const expiration = Number(localStorage.getItem('expiration'));
        const now = Math.floor(Date.now() / 1000);
        if (now > expiration) {
            const refresh_token = localStorage.getItem('refresh_token');
            const url = 'http://localhost:8000/refresh';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh_token }),
            });

            if (response.status === 200) {
                const data = await response.json();
                const { session, user } = data;
                localStorage.clear();
                localStorage.setItem('user_id', user.id);
                localStorage.setItem('access_token', session.access_token);
                localStorage.setItem('refresh_token', session.refresh_token);
                localStorage.setItem('expiration', session.expires_at);
            } else {
                // The refresh token is invalid.
                console.error('ERROR:', response);
            }
        } else {
            // If the token hasn't expired, no need to do anything
            console.info("Token still valid")
            return;
        }
    };

    return (
        <AuthContext.Provider value={{ isAuth, setIsAuth, refreshSession }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

AuthProvider.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]).isRequired,
};
