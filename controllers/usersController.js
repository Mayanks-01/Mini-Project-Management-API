const pool = require("../db");
const { v4: uuid } = require("uuid");

exports.createUser = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email)
    return res.status(400).json({ error: "Name & email required" });

  if (!email.includes("@"))
    return res.status(400).json({ error: "Invalid email format" });

  try {
    const [exists] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (exists.length > 0)
      return res.status(400).json({ error: "Email already exists" });

    const id = uuid();

    await pool.query(
      "INSERT INTO users (id, name, email) VALUES (?, ?, ?)",
      [id, name, email]
    );

    res.json({ id, name, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
