const express = require('express');
const Task = require('../models/Task');
const validateTask = require('../utils/validateTask');

const router = express.Router();

// GET all tasks
router.get('/', async (req, res) => {
  try {
    res.json(await Task.find().sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE task
router.post('/', async (req, res) => {
  const { isValid, errors } = validateTask(req.body);
  if (!isValid) return res.status(400).json({ errors });
  try {
    res.status(201).json(await Task.create(req.body));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
