import Routes from './routes/Routes';
import { AuthProvider } from './AuthContext';

import './global.css';

function App() {
    return (
        <AuthProvider>
            <Routes />
        </AuthProvider>
    );
}

export default App;
