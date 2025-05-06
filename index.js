const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public')); // For static files like CSS

// MongoDB connection
const uri = 'mongodb+srv://user1:user1@cluster0.oirfx2r.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB Atlas!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err);
  });

// MongoDB Task Schema
const taskSchema = new mongoose.Schema({
    title: String,
    priority: String,
    completed: { type: Boolean, default: false }
});

const Task = mongoose.model('Task', taskSchema);

// Route to get all tasks
app.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.render('list', { tasks: tasks });
    } catch (err) {
        console.error("Error fetching tasks:", err);
        res.status(500).send("Error fetching tasks");
    }
});

// Route to add a new task
app.post('/add', async (req, res) => {
    try {
        const newTask = new Task({
            title: req.body.taskTitle,
            priority: req.body.priority
        });

        await newTask.save();
        res.redirect('/');
    } catch (err) {
        console.error("Error saving task:", err);
        res.status(500).send("Error adding task");
    }
});

// Route to delete a task
app.post('/delete', async (req, res) => {
    const taskId = req.body.taskId;

    try {
        await Task.findByIdAndDelete(taskId);
        res.redirect('/');
    } catch (err) {
        console.error("Error deleting task:", err);
        res.status(500).send("Error deleting task");
    }
});


// Route to edit a task
app.post('/edit', async (req, res) => {
    const taskId = req.body.taskId;
    const updatedTitle = req.body.updatedTitle;
    const updatedPriority = req.body.updatedPriority;

    try {
        await Task.findByIdAndUpdate(taskId, { title: updatedTitle, priority: updatedPriority });
        res.redirect('/');
    } catch (err) {
        console.error("Error updating task:", err);
        res.status(500).send("Error updating task");
    }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
