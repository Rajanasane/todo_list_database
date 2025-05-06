const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // For PUT and DELETE requests
app.set('view engine', 'ejs');
app.use(express.static('public')); // For static files like CSS

// MongoDB connection
const uri = 'mongodb+srv://user1:user1@cluster0.oirfx2r.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch(err => console.error("MongoDB error:", err));

// Task Schema
const taskSchema = new mongoose.Schema({
  title: String,
  priority: String,
  completed: { type: Boolean, default: false }
});

const Task = mongoose.model('Task', taskSchema);

// GET: All tasks
app.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.render('list', { tasks });
  } catch (err) {
    res.status(500).send("Error fetching tasks");
  }
});

// POST: Add task
app.post('/add', async (req, res) => {
  try {
    const newTask = new Task({
      title: req.body.taskTitle,
      priority: req.body.priority
    });
    await newTask.save();
    res.redirect('/');
  } catch (err) {
    res.status(500).send("Error adding task");
  }
});

// PUT: Edit task
app.put('/edit/:id', async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, {
      title: req.body.updatedTitle,
      priority: req.body.updatedPriority
    });
    res.json({ message: 'Task updated' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating task' });
  }
});

// DELETE: Delete task
app.delete('/delete/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
