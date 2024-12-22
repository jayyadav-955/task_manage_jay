import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Grid, Box, MenuItem, Select, InputLabel, FormControl, Alert } from '@mui/material';
import { DateTimePicker } from '@mui/lab';
import API from '../api';
import { jwtDecode } from 'jwt-decode';  // Import for decoding JWT

const CreateTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [reminderTime, setReminderTime] = useState(60);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.id);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskData = {
      title,
      description,
      due_date: dueDate.toISOString(),
      reminder_time: reminderTime,
      user_id: userId,
    };

    try {
      await API.post('/tasks', taskData);
      setSuccess(true);
      setError('');
      setTitle('');
      setDescription('');
      setDueDate(new Date());
      setReminderTime(60);
    } catch (err) {
      setSuccess(false);
      setError('Error creating task');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Create Task</Typography>
      <form onSubmit={handleSubmit}>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">Task created successfully!</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <DateTimePicker
              label="Due Date"
              value={dueDate}
              onChange={setDueDate}
              renderInput={(props) => <TextField {...props} fullWidth />}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Reminder Time (minutes)</InputLabel>
              <Select
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
              >
                <MenuItem value={15}>15 minutes</MenuItem>
                <MenuItem value={30}>30 minutes</MenuItem>
                <MenuItem value={60}>1 hour</MenuItem>
                <MenuItem value={1440}>1 day</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">Create Task</Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default CreateTask;
