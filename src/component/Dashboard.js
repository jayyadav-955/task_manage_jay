import React, { useEffect, useState } from 'react';
import API from '../api';

function Dashboard() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setMessage('Please login first.');
                    return;
                }
                // Example: Fetch protected data
                const response = await API.get('/protected', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setMessage(response.data.message || 'Welcome to the dashboard!');
            } catch (error) {
                setMessage('Access denied.');
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h2>Dashboard</h2>
            <p>{message}</p>
        </div>
    );
}

export default Dashboard;

