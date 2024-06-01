import Task from "../models/task.js";
import User from "../models/user.js";

export async function createTask(req, res) {
  try {
    const { title, description, due_date } = req.body;

    const userId = req.user.id;

    if (!title || !description || !due_date || !userId) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const task = new Task({
      title,
      description,
      due_date,
      userId,
    });

    await task.save();

    res.json({ message: "Task created successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create task." });
  }
}

export async function getTasks(req, res) {
  try {
    const userId = req.params.userId;

    const tasks = await Task.find({ userId });

    return res.status(200).json(tasks);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid user ID." });
    }
    return res.status(500).json({ error: "Failed to retrieve tasks." });
  }
}

export async function getSingleTask(req, res) {
  try {
    const taskId = req.params.taskId;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve task." });
  }
}

export async function updateTask(req, res) {
  try {
    const taskId = req.params.taskId;

    const { title, description, due_date, status } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (due_date) task.due_date = due_date;
    if (status !== undefined) task.status = status;

    await task.save();

    res.json({ message: "Task updated successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to update task." });
  }
}

export async function deleteTask(req, res) {
  try {
    const taskId = req.params.taskId;

    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    res.json({ message: "Task deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task." });
  }
}
