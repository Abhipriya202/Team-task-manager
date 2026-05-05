const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const protect = require("../middleware/authMiddleware");

// Dashboard Stats
router.get("/", protect, async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: "done" });
    const pendingTasks = await Task.countDocuments({ status: "pending" });
    const inProgressTasks = await Task.countDocuments({ status: "in-progress" });

    const overdueTasks = await Task.countDocuments({
      dueDate: { $lt: new Date() },
      status: { $ne: "done" }
    });

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;