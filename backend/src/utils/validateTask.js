// Pure validation logic - easy to unit test, no DB needed.
function validateTask(task = {}) {
  const errors = [];

  if (!task.title || typeof task.title !== 'string' || !task.title.trim()) {
    errors.push('Title is required');
  } else if (task.title.trim().length > 100) {
    errors.push('Title must be 100 characters or less');
  }

  const allowedStatus = ['pending', 'in-progress', 'completed'];
  if (task.status !== undefined && !allowedStatus.includes(task.status)) {
    errors.push('Status must be pending, in-progress or completed');
  }

  return { isValid: errors.length === 0, errors };
}

module.exports = validateTask;
