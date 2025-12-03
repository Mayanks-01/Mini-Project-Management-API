const pool = require("../db");
const { v4: uuid } = require("uuid");

exports.createProject = async (req, res) => {
  const { name, description, owner_id } = req.body;

  if (!name || !owner_id)
    return res.status(400).json({ error: "Name & owner_id required" });

  try {
    const [user] = await pool.query(
      "SELECT id FROM users WHERE id = ?",
      [owner_id]
    );

    if (user.length === 0)
      return res.status(400).json({ error: "Owner does not exist" });

    const id = uuid();

    await pool.query(
      "INSERT INTO projects (id, name, description, owner_id) VALUES (?, ?, ?, ?)",
      [id, name, description || "", owner_id]
    );

    res.json({ id, name, description, owner_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
