import React, { useState } from 'react';
import { TextField, Button, Container, Grid, Typography } from '@mui/material';
import API from '../api';
import { useNavigate } from 'react-router-dom';


function Register() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post('/register', formData);
            setMessage(response.data.message);
            navigate('/login');
        } catch (error) {
            setMessage(error.response.data.message || 'Error occurred');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <div>
                <Typography variant="h5">Register</Typography>
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
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
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
                        Register
                    </Button>
                </form>
                {message && <Typography variant="body2" color="error" style={{ marginTop: '16px' }}>{message}</Typography>}
                               
            </div>
        </Container>
    );
}

export default Register;
