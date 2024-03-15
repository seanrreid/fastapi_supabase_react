/* eslint-disable react-refresh/only-export-components */
import { Form, useNavigate, useActionData } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Wrapper from '../components/Wrapper';
import Button from '../components/Button';

import styles from './form.module.css';
import { useEffect } from 'react';

export const action = async ({ request }) => {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    const loginData = { email, password };

    try {
        const url = 'http://localhost:8000/login';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        const statusCode = response.status;

        if (statusCode === 200) {
            const data = await response.json();
            const { session } = data;
            localStorage.clear();
            localStorage.setItem('access_token', session.access_token);
            localStorage.setItem('refresh_token', session.refresh_token);
            localStorage.setItem('expiration', session.expires_at);
        }
        return statusCode === 200 ? true : false;
    } catch (error) {
        console.error('ERROR: ', error);
        return false;
    }
};

const Login = () => {
    const response = useActionData();
    const navigate = useNavigate();
    const { setIsAuth } = useAuth();

    useEffect(() => {
        const checkAuth = () => {
            if (typeof response !== 'undefined') {
                setIsAuth(response);
                return response && navigate(`/`);
            }
        };
        checkAuth();
    }, [response, setIsAuth, navigate]);

    return (
        <Wrapper>
            <h1>Login</h1>
            {response === false && <div>Invalid Login</div>}
            <Form method='post' action='/login' className={styles.form}>
                <label>
                    Email Address
                    <input type='email' name='email' autoComplete='email' />
                </label>
                <label>
                    Password
                    <input
                        type='password'
                        name='password'
                        autoComplete='current-password'
                    />
                </label>
                <Button type='submit'>Login</Button>
            </Form>
        </Wrapper>
    );
};

export default Login;
