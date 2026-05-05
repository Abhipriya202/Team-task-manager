const express = require("express");
const router = express.Router();

const Project = require("../models/Project");
const protect = require("../middleware/authMiddleware");
const roleCheck = require("../middleware/roleMiddleware");

// CREATE PROJECT (ADMIN ONLY)
router.post("/", protect, roleCheck("admin"), async (req, res) => {
  try {
    const project = await Project.create({
      name: req.body.name,
      description: req.body.description,
      createdBy: req.user.id
    });

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL PROJECTS
router.get("/", protect, async (req, res) => {
  const projects = await Project.find().populate("members");
  res.json(projects);
});

module.exports = router;