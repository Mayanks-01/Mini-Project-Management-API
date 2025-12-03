const pool = require("../db");
const { v4: uuid } = require("uuid");

exports.addComment = async (req, res) => {
  const task_id = req.params.id;
  const { user_id, message } = req.body;

  if (!user_id || !message)
    return res.status(400).json({ error: "user_id & message required" });

  try {
    const [task] = await pool.query(
      "SELECT id FROM tasks WHERE id = ?",
      [task_id]
    );

    if (task.length === 0)
      return res.status(400).json({ error: "Task does not exist" });

    const [user] = await pool.query(
      "SELECT id FROM users WHERE id = ?",
      [user_id]
    );

    if (user.length === 0)
      return res.status(400).json({ error: "User does not exist" });

    const id = uuid();

    await pool.query(
      "INSERT INTO comments (id, task_id, user_id, message) VALUES (?, ?, ?, ?)",
      [id, task_id, user_id, message]
    );

    res.json({ id, task_id, user_id, message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
