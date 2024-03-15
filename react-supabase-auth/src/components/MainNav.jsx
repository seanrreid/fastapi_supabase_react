import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

import Wrapper from './Wrapper';

import styles from './nav.module.css';

export default function MainNav() {
    const { isAuth } = useAuth();
    return (
        <Wrapper>
            <nav className={styles.nav}>
                <ul>
                    <li>
                        <Link to='/'>Home</Link>
                    </li>

                    {isAuth ? (
                        <>
                            <li>
                                <Link to='/protected'>Protected</Link>
                            </li>
                            <li>
                                <Link to='/logout'>Logout</Link>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link to='/login'>Login</Link>
                        </li>
                    )}
                </ul>
            </nav>
        </Wrapper>
    );
}
