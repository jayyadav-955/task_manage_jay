import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    IconButton,
    Grid,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Fab,
    Alert, CardActions
} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";
import API from "../api";
import { jwtDecode } from 'jwt-decode';
// Correct JWT decode import

const TaskManagerList = () => {
    const [reminderTime, setReminderTime] = useState(60);

    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState("");
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [editTaskData, setEditTaskData] = useState({ title: "", description: "", due_date: "", reminderTime: 15 });
    const [userId, setUserId] = useState(null);
    const [addTaskDialogOpen, setAddTaskDialogOpen] = useState(false);
    const [newTaskData, setNewTaskData] = useState({ title: "", description: "", due_date: new Date().toISOString(), reminderTime: 15 });
    const [success, setSuccess] = useState(false);
    const [done, setDone] = useState(false);



    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.id);
        } else {
            setError("User not logged in or missing credentials.");
        }
    }, []);

    useEffect(() => {
        if (userId) fetchTasks();
    }, [userId]);

    // const fetchTasks = async () => {
    //     try {
    //         const response = await API.get(`/get/${userId}`);
    //         console.log(response.data)
    //         setTasks(response.data);
    //     } catch (err) {
    //         setError("Error fetching tasks.",err);
    //     }
    // };
    const fetchTasks = async () => {
        try {
            const response = await API.get(`/get/${userId}`);
            setTasks(response.data);
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Unknown error occurred.";

            setError(`Error fetching tasks: ${errorMessage}`);
        }
    };


    // const handleDelete = async (taskId) => {
    //     try {
    //         await API.delete(`/delete/${taskId}`);
    //         setTasks(tasks.filter((task) => task.id !== taskId));
    //     } catch (err) {
    //         setError("Error deleting task.");
    //     }
    // };

    const handleDelete = async (taskId) => {
        try {
            const response = await API.delete(`/delete/${taskId}`);


            const successMessage = response.data?.message || "Task deleted successfully.";
            console.log(successMessage);

            setTasks(tasks.filter((task) => task.id !== taskId));

            setSuccess(successMessage);
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Error deleting task.";
            console.error("Error deleting task:", errorMessage);
            setError(errorMessage);
        }
    };

    const handleEditOpen = (task) => {
        setCurrentTask(task);
        setEditTaskData({
            title: task.title,
            description: task.description,
            due_date: new Date(task.due_date).toISOString().slice(0, 16),
            reminderTime: task.reminderTime || 15,
        });
        setEditDialogOpen(true);
    };

    const handleEditClose = () => {
        setEditDialogOpen(false);
        setCurrentTask(null);
        setEditTaskData({ title: "", description: "", due_date: "", reminder_time: 15 });
    };
    const handleEditSave = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("User not logged in.");

            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id;

            const updatedTaskData = {
                user_id: userId,
                ...editTaskData,
                reminder_time: reminderTime,
            };

            const response = await API.put(`/update/${currentTask.id}/`, updatedTaskData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            setSuccess(response.data?.message || "Task updated successfully!");

            setTasks(tasks.map((task) =>
                task.id === currentTask.id ? { ...task, ...editTaskData, reminder_time: reminderTime } : task
            ));
            handleEditClose();
        } catch (err) {
            console.error("Update error:", err.response?.data || err.message);

            setError(err.response?.data?.message || "Error updating task. Please try again.");
        }
    };





    const handleAddTaskOpen = () => {
        setAddTaskDialogOpen(true);
    };

    const handleAddTaskClose = () => {
        setAddTaskDialogOpen(false);
    };

    const handleAddTaskSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id;

            // Prepare task data
            const taskData = {
                user_id: userId,
                title: newTaskData.title,
                description: newTaskData.description,
                due_date: new Date(newTaskData.due_date).toISOString(), // Ensure correct date format
                reminder_time: newTaskData.reminderTime, // Match backend's expected key
            };

            // Make API call
            const response = await API.post('/tasks', taskData);

            // Set success message dynamically from server response
            setSuccess(response.data?.message || 'Task created successfully!');
            setError(''); // Clear any existing error

            // Reset form and fetch updated tasks
            setNewTaskData({ title: "", description: "", due_date: new Date(), reminder_time: 15 });
            fetchTasks();
            setAddTaskDialogOpen(false); // Close dialog
        } catch (err) {
            // Extract error message from backend or fallback to default
            const errorMessage = err.response?.data?.message || 'Error creating task.';
            setSuccess(''); // Clear success state
            setError(errorMessage); // Set error message dynamically
        }
    };

    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => {
                setSuccess('');
                setError('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [success, error]);

    const handleCompleteToggle = async (id) => {
        const taskToUpdate = tasks.find((task) => task.id === id);
        const updatedCompleteStatus = !taskToUpdate.complete;
    
        console.log("Sending PUT request with payload:", { complete: updatedCompleteStatus });
    
        try {
            const response = await API.put(`/complete/${id}`, {
                complete: updatedCompleteStatus,
            });
            if (response.status !== 200 && response.status !== 201) {
                throw new Error(`Failed to update task with id ${id}`);
            }
    
            const result = response.data;
            console.log("Response received:", result);
    
            if (result.task && result.task.complete !== undefined) {
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task.id === id ? { ...task, complete: result.task.complete } : task
                    )
                );
            } else {
                throw new Error(`Unexpected response structure for task id ${id}`);
            }
        } catch (error) {
            console.error("Error updating task:", error);
            alert(`Failed to update task: ${error.message}`);
        }
    };
    
    

    return (
        <Box sx={{ padding: 4 }}>

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <Grid container spacing={3}>
                {tasks.map((task) => (
                    <Grid item xs={12} sm={6} md={4} key={task.id}>
                        <Card
                            sx={{
                                maxWidth: 345,
                                backgroundColor: task.complete ? "#89dc57 " : "#e36a83", 
                                boxShadow: 3,
                                borderRadius: 1,
                            }}
                        >
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    {task.title}
                                </Typography>
                                <Typography>{task.description}</Typography>
                                <Typography>Due: {task.due_date}</Typography>
                                <Typography>Reminder: {task.reminderTime} mins</Typography>
                                <Box
                                    sx={{
                                        marginTop: 2,
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <IconButton onClick={() => handleEditOpen(task)} color="primary">
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(task.id)} color="secondary">
                                        <Delete />
                                    </IconButton>
                                </Box>
                            </CardContent>
                            <CardActions>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        width: "100%",
                                    }}
                                >
                                    <Button onClick={() => handleCompleteToggle(task.id)} variant="outlined">
                                        {task.complete ? "Incomplete" : "Complete"}
                                    </Button>
                                </Box>
                            </CardActions>
                        </Card>

                    </Grid>
                ))}
            </Grid>
            <Fab color="primary" aria-label="add" onClick={handleAddTaskOpen} sx={{ position: 'fixed', bottom: 16, right: 16 }}>
                <Add />
            </Fab>

            <Dialog open={editDialogOpen} onClose={handleEditClose}>
                <DialogTitle>Edit Task</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Title"
                        fullWidth
                        value={editTaskData.title}
                        onChange={(e) => setEditTaskData({ ...editTaskData, title: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        value={editTaskData.description}
                        onChange={(e) => setEditTaskData({ ...editTaskData, description: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Due Date"
                        type="datetime-local"
                        fullWidth
                        value={editTaskData.due_date}
                        onChange={(e) => setEditTaskData({ ...editTaskData, due_date: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                    />
                    <FormControl fullWidth>
                        <InputLabel>Reminder Time (minutes)</InputLabel>
                        <Select
                            value={editTaskData.reminderTime}
                            onChange={(e) => setEditTaskData({ ...editTaskData, reminderTime: e.target.value })}
                        >
                            <MenuItem value={15}>15 minutes</MenuItem>
                            <MenuItem value={30}>30 minutes</MenuItem>
                            <MenuItem value={60}>1 hour</MenuItem>
                            <MenuItem value={1440}>1 day</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose}>Cancel</Button>
                    <Button onClick={handleEditSave}>Save</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={addTaskDialogOpen} onClose={handleAddTaskClose}>
                <DialogTitle>Add Task</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Title"
                        fullWidth
                        value={newTaskData.title}
                        onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        value={newTaskData.description}
                        onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Due Date"
                        type="datetime-local"
                        fullWidth
                        value={newTaskData.due_date}
                        onChange={(e) => setNewTaskData({ ...newTaskData, due_date: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                    />
                    <FormControl fullWidth>
                        <InputLabel>Reminder Time (minutes)</InputLabel>
                        <Select
                            value={newTaskData.reminderTime}
                            onChange={(e) => setNewTaskData({ ...newTaskData, reminderTime: e.target.value })}
                        >
                            <MenuItem value={15}>15 minutes</MenuItem>
                            <MenuItem value={30}>30 minutes</MenuItem>
                            <MenuItem value={60}>1 hour</MenuItem>
                            <MenuItem value={1440}>1 day</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddTaskClose}>Cancel</Button>
                    <Button onClick={handleAddTaskSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TaskManagerList;
