import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import API from '../api';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [token, setToken] = useState('');
    const [messageType, setMessageType] = useState('');
    const [showPassword, setShowPassword] = useState(false); // New state for password visibility

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post('/login', formData);
            localStorage.setItem('token', response.data.token);
            setToken(response.data.token);
            setMessage('Login successful!');
            setMessageType('success');
            navigate('/tasklist');
        } catch (error) {
            setMessage(error.response.data.message || 'Invalid credentials');
            setMessageType('error');
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Container component="main" maxWidth="xs">
            <div>
                <Typography variant="h5">Login</Typography>
                <form noValidate onSubmit={handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? "text" : "password"} // Toggle between text and password based on state
                        id="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        InputProps={{
                            endAdornment: (
                                <Button onClick={toggleShowPassword} style={{ marginLeft: '8px' }}>
                                    {showPassword ? 'Hide' : 'Show'}
                                </Button>
                            )
                        }}
                    />
                    <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: '24px' }}>
                        Login
                    </Button>
                </form>
                {message && (
                    <Box
                        mt={2}
                        bgcolor={messageType === 'success' ? 'success.main' : 'error.main'}
                        p={2}
                        borderRadius={1}
                    >
                        <Typography variant="body2" color="white">
                            {message}
                        </Typography>
                    </Box>
                )}
            </div>
        </Container>
    );
}

export default Login;
