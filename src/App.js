import React from 'react';
import './App.css'; 
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './component/Navbar';
import Register from './component/Register';
import Login from './component/Login';
import Dashboard from './component/Dashboard';
import { Container, CssBaseline, Typography } from '@mui/material';
import CreateTask from './component/Taskmanage';
import TaskManagelist from './component/Tasklist';

function App() {
    const token = localStorage.getItem('token');

    return (
        <Router>
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                <Navbar />
                <Typography variant="h3" align="center" style={{ margin: '24px 0' }}>
                    Task Manager
                </Typography>
                <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/taskmanage" element={token ? <CreateTask /> : <Navigate to="/login" />} />
                    <Route path="/tasklist" element={token ? <TaskManagelist /> : <Navigate to="/login" />} />

                    
                </Routes>
            </Container>
        </Router>
    );
}

export default App;
