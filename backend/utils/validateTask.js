// utils/validateTask.js

function validateTask(data) {
  if (!data) return { valid: false, error: "No data provided" };

  if (!data.title || data.title.trim() === "") {
    return { valid: false, error: "Title is required" };
  }

  if (data.title.length < 3) {
    return { valid: false, error: "Title must be at least 3 characters" };
  }

  return { valid: true };
}

module.exports = validateTask;
