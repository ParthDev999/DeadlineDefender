const Task = require("../models/Task");

// Create new task
const createTask = async (req, res) => {
  try {
    const { title, description, deadline, priority, estimatedTime } = req.body;

    if (!title || !deadline) {
      return res.status(400).json({
        message: "Title and deadline are required",
      });
    }

    const task = await Task.create({
      title,
      description,
      deadline,
      priority,
      estimatedTime,
      user: req.user._id,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Task creation failed",
      error: error.message,
    });
  }
};

// Get logged-in user's tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({
      deadline: 1,
    });

    res.status(200).json({
      message: "Tasks fetched successfully",
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to update this task",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, {
      new: true,
    });

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: "Task update failed",
      error: error.message,
    });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to delete this task",
      });
    }

    await Task.findByIdAndDelete(taskId);

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Task deletion failed",
      error: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};