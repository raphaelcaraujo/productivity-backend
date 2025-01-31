require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// ✅ Initialize Express app
const app = express();

// ✅ Middleware
app.use(cors()); // Enable CORS for frontend access
app.use(express.json()); // Parse incoming JSON requests

// ✅ Check if MONGO_URI is provided
if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is not defined in environment variables!");
  process.exit(1);
}

// ✅ Connect to MongoDB with enhanced error handling
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((error) => {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  });

// ✅ Define Task Schema & Model
const taskSchema = new mongoose.Schema({
  dueDate: { type: String, required: true },
  completeDate: { type: String, default: null },
  description: { type: String, required: true },
  category: { type: String, required: true },
  timeCommitment: { type: Number, default: 0 },
});

const Task = mongoose.model("Task", taskSchema);

// ✅ Route to handle form submission (Create Task)
app.post("/save-task", async (req, res) => {
  try {
    console.log("📩 Form Data Received:", req.body);

    const { dueDate, description, category, timeCommitment } = req.body;

    // ✅ Validate required fields
    if (!dueDate || !description || !category) {
      return res.status(400).json({ error: "❌ Missing required fields" });
    }

    const newTask = new Task({
      dueDate,
      description,
      category,
      timeCommitment: timeCommitment || 0,
    });

    await newTask.save();
    console.log("✅ Task Saved:", newTask);

    res.status(201).json({ message: "✅ Task saved successfully!", task: newTask });
  } catch (error) {
    console.error("❌ Save Error:", error);
    res.status(500).json({ error: "❌ Failed to save task" });
  }
});

// ✅ Fetch all tasks (Read)
app.get("/all-tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    console.log("📤 Sending tasks:", tasks);
    res.json(tasks);
  } catch (error) {
    console.error("❌ Error retrieving tasks:", error);
    res.status(500).json({ message: "❌ Server error" });
  }
});

// ✅ Update a task (Complete Task)
app.put("/update-task/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { completeDate } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { completeDate },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "❌ Task not found" });
    }

    res.json({ message: "✅ Task updated successfully!", task: updatedTask });
  } catch (error) {
    console.error("❌ Error updating task:", error);
    res.status(500).json({ message: "❌ Server error" });
  }
});

// ✅ Start the server (For Local Testing)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

module.exports = app; // ✅ Export for Vercel
