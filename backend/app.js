import express from "express";
import cors from "cors";
import Database from "better-sqlite3";

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a SQLite
const db = new Database("./tasks.db");

// Crear tabla si no existe
db.prepare(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0
  )
`).run();

/* ---------------------- RUTAS ---------------------- */

// Ruta raíz para Playwright / check rápido
app.get("/", (req, res) => {
  res.send("Backend TaskFlow corriendo 🚀");
});

// Obtener tareas
app.get("/tasks", (req, res) => {
  const tasks = db.prepare("SELECT * FROM tasks").all();
  res.json(tasks);
});

// Crear tarea
app.post("/tasks", (req, res) => {
  const { title } = req.body;
  const info = db
    .prepare("INSERT INTO tasks (title, completed) VALUES (?, 0)")
    .run(title);
  res.json({ id: info.lastInsertRowid, title, completed: 0 });
});

// Actualizar tarea
app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const result = db
    .prepare("UPDATE tasks SET title = ?, completed = ? WHERE id = ?")
    .run(title, completed, id);
  res.json({ updated: result.changes });
});

// Eliminar tarea individual
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const result = db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
  res.json({ deleted: result.changes });
});

// Eliminar TODAS las tareas
app.delete("/tasks", (req, res) => {
  db.prepare("DELETE FROM tasks").run();
  res.json({ message: "All tasks deleted" });
});

/* -------------------------------------------------- */

export default app;
