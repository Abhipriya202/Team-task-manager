const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const protect = require("../middleware/authMiddleware");
const roleCheck = require("../middleware/roleMiddleware");

// CREATE TASK (Admin only)
router.post("/", protect, roleCheck("admin"), async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      project: req.body.project,
      assignedTo: req.body.assignedTo,
      dueDate: req.body.dueDate,
      createdBy: req.user.id
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET TASKS
router.get("/", protect, async (req, res) => {
  const tasks = await Task.find()
    .populate("assignedTo", "name email")
    .populate("project", "name");

  res.json(tasks);
});

// UPDATE TASK STATUS (Member/Admin)
router.put("/:id", protect, async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  task.status = req.body.status || task.status;

  await task.save();

  res.json(task);
});

module.exports = router;