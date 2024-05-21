import Task from "../models/task.js";
import User from "../models/user.js";

export async function createTask(req, res) {
  try {
    // İstek gövdesinden gerekli alanları al
    const { title, description, due_date } = req.body;

    // Kullanıcı kimliğini doğrulanmış kullanıcıdan al
    const userId = req.user.id;

    // Tüm gerekli alanlar mevcut mu kontrol et
    if (!title || !description || !due_date || !userId) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Yeni bir görev nesnesi oluştur
    const task = new Task({
      title,
      description,
      due_date,
      userId, // userId'yi eklemeyi unutmayın
    });

    // Görevi veritabanına kaydet
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

    // Kullanıcının görevlerini doğrudan filtreleyerek al
    const tasks = await Task.find({ userId });

    // Görevleri yanıt olarak gönder
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
    // Parametrelerden görev kimliğini al
    const taskId = req.params.taskId;

    // Görevi görev kimliğine göre bul
    const task = await Task.findById(taskId);

    // Görev bulunamadıysa hata döndür
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
    // Parametrelerden görev kimliğini al
    const taskId = req.params.taskId;

    // İstek gövdesinden güncellenmiş alanları al
    const { title, description, due_date, status } = req.body;

    // Görevi görev kimliğine göre bul
    const task = await Task.findById(taskId);

    // Görev bulunamadıysa hata döndür
    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    // Güncellenmiş alanları varsa görevi güncelle
    if (title) task.title = title;
    if (description) task.description = description;
    if (due_date) task.due_date = due_date;
    if (status !== undefined) task.status = status;

    // Görevi veritabanında kaydet
    await task.save();

    res.json({ message: "Task updated successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to update task." });
  }
}

export async function deleteTask(req, res) {
  try {
    // Parametrelerden görev kimliğini al
    const taskId = req.params.taskId;

    // Görevi görev kimliğine göre bul ve sil
    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    res.json({ message: "Task deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task." });
  }
}
