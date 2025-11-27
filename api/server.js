// api/server.js (Postgres - fixed full)
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const connectionString = process.env.DATABASE_URL;
if (!connectionString) { console.warn("No DATABASE_URL set. Please set process.env.DATABASE_URL before running the server."); }
const pool = new Pool({ connectionString });

async function q(text, params) {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
}

// --- Employees ---
app.get('/employees', async (req, res) => {
  try {
    const r = await q('SELECT * FROM employees ORDER BY id', []);
    res.json(r.rows);
  } catch (err) {
    console.error('GET /employees', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/employees', async (req, res) => {
  try {
    const { name, role = '', email = '' } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    const r = await q('INSERT INTO employees(name, role, email) VALUES($1,$2,$3) RETURNING *', [name, role, email]);
    res.status(201).json(r.rows[0]);
  } catch (err) {
    console.error('POST /employees', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/employees/:id', async (req, res) => {
  try {
    const { name, role, email } = req.body;
    const { id } = req.params;
    const r = await q('UPDATE employees SET name=$1, role=$2, email=$3 WHERE id=$4 RETURNING *', [name, role, email, id]);
    if (r.rowCount === 0) return res.status(404).json({ error: 'not found' });
    res.json(r.rows[0]);
  } catch (err) {
    console.error('PUT /employees/:id', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await q('DELETE FROM employees WHERE id=$1', [id]);
    res.json({ deleted: true });
  } catch (err) {
    console.error('DELETE /employees/:id', err);
    res.status(500).json({ error: err.message });
  }
});

// --- Tasks (with assigned_name join) ---
app.get('/tasks', async (req, res) => {
  try {
    const r = await q(`
      SELECT t.*,
             e.name AS assigned_name
      FROM tasks t
      LEFT JOIN employees e ON t.assignedTo = e.id
      ORDER BY t.id
    `);
    res.json(r.rows);
  } catch (err) {
    console.error('GET /tasks', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    let { title, description = '', status = 'todo', assignedTo = null } = req.body;
    if (!title) return res.status(400).json({ error: 'title required' });

    assignedTo = (assignedTo === null || assignedTo === '' || typeof assignedTo === 'undefined') ? null : Number(assignedTo);

    const r = await q(
      'INSERT INTO tasks(title, description, status, assignedTo) VALUES($1,$2,$3,$4) RETURNING *',
      [title, description, status, assignedTo]
    );

    // return inserted row with assigned_name
    const inserted = r.rows[0];
    const jr = await q('SELECT t.*, e.name AS assigned_name FROM tasks t LEFT JOIN employees e ON t.assignedTo = e.id WHERE t.id=$1', [inserted.id]);
    res.status(201).json(jr.rows[0]);
  } catch (err) {
    console.error('POST /tasks', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/tasks/:id', async (req, res) => {
  try {
    const { title, description, status, assignedTo } = req.body;
    const { id } = req.params;
    const assigned = (assignedTo === null || assignedTo === '' || typeof assignedTo === 'undefined') ? null : Number(assignedTo);
    const r = await q('UPDATE tasks SET title=$1, description=$2, status=$3, assignedTo=$4 WHERE id=$5 RETURNING *', [title, description, status, assigned, id]);
    if (r.rowCount === 0) return res.status(404).json({ error: 'not found' });
    const jr = await q('SELECT t.*, e.name AS assigned_name FROM tasks t LEFT JOIN employees e ON t.assignedTo = e.id WHERE t.id=$1', [id]);
    res.json(jr.rows[0]);
  } catch (err) {
    console.error('PUT /tasks/:id', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await q('DELETE FROM tasks WHERE id=$1', [id]);
    res.json({ deleted: true });
  } catch (err) {
    console.error('DELETE /tasks/:id', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API (Postgres) listening on ${PORT}`));
