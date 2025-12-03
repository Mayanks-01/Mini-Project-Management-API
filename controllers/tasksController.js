const pool = require("../db");
const { v4: uuid } = require("uuid");

exports.createTask = async (req, res) => {
  const { project_id, title, description, assigned_to } = req.body;

  if (!project_id || !title)
    return res.status(400).json({ error: "project_id & title required" });

  try {
    // Check project exists
    const [proj] = await pool.query(
      "SELECT id FROM projects WHERE id = ?",
      [project_id]
    );
    if (proj.length === 0)
      return res.status(400).json({ error: "Project does not exist" });

    // Check assigned user exists if provided
    if (assigned_to) {
      const [user] = await pool.query(
        "SELECT id FROM users WHERE id = ?",
        [assigned_to]
      );
      if (user.length === 0)
        return res.status(400).json({ error: "Assigned user does not exist" });
    }

    const id = uuid();

    await pool.query(
      `INSERT INTO tasks
       (id, project_id, title, description, assigned_to)
       VALUES (?, ?, ?, ?, ?)`,
      [id, project_id, title, description || "", assigned_to || null]
    );

    res.json({ id, project_id, title, description, assigned_to });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.listTasks = async (req, res) => {
  const { project_id, status, assigned_to, page = 1, limit = 10 } = req.query;

  const offset = (Number(page) - 1) * Number(limit);

  let where = [];
  let params = [];

  if (project_id) {
    where.push("t.project_id = ?");
    params.push(project_id);
  }

  if (status) {
    where.push("t.status = ?");
    params.push(status);
  }

  if (assigned_to) {
    where.push("t.assigned_to = ?");
    params.push(assigned_to);
  }

  const whereClause = where.length ? "WHERE " + where.join(" AND ") : "";

  try {
    const [tasks] = await pool.query(
      `
      SELECT 
        t.*,
        p.name AS project_name,
        u.name AS assigned_user_name,
        (
          SELECT message FROM comments c
          WHERE c.task_id = t.id
          ORDER BY c.created_at DESC
          LIMIT 1
        ) AS latest_comment
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN users u ON t.assigned_to = u.id
      ${whereClause}
      ORDER BY t.created_at DESC
      LIMIT ? OFFSET ?
    `,
      [...params, Number(limit), offset]
    );

    res.json({ tasks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
