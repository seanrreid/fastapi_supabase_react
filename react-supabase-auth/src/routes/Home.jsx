import { useLoaderData } from 'react-router-dom';

export const loader = async () => {
    try {
        const url = 'http://localhost:8000/protected';
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
        });

        // const statusCode = response.status;
        const data = await response.json();

        return data;
    } catch (error) {
        console.error('ERROR: ', error);
        return false;
    }
};

const Home = () => {
    const data = useLoaderData();
    return (
        <>
            <h1>Home Page</h1>
            {!!data && <p>{data.detail}</p>}
        </>
    );
};

export default Home;
