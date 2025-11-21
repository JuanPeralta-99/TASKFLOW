import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const reload = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/tasks");
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;
    await fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    reload();
  };

  const toggleTask = async (task) => {
    await fetch(`http://localhost:3000/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: task.title, completed: task.completed ? 0 : 1 }),
    });
    reload();
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:3000/tasks/${id}`, { method: "DELETE" });
    reload();
  };

  const deleteAll = async () => {
    await fetch("http://localhost:3000/tasks", { method: "DELETE" });
    setShowModal(false);
    reload();
  };

  const saveEdit = async () => {
    if (!editTitle.trim()) return;
    const taskIndex = tasks.findIndex((t) => t.id === editId);
    if (taskIndex === -1) return;

    const updatedTask = { ...tasks[taskIndex], title: editTitle };

    await fetch(`http://localhost:3000/tasks/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, completed: updatedTask.completed }),
    });

    const newTasks = [...tasks];
    newTasks[taskIndex] = updatedTask;
    setTasks(newTasks);

    setEditId(null);
    setEditTitle("");
  };

  const filteredTasks = tasks
    .filter((t) => {
      if (filter === "completed") return t.completed === 1;
      if (filter === "pending") return t.completed === 0;
      return true;
    })
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>TaskFlow</h1>

        <div style={styles.stats}>
          <span>Total: {tasks.length}</span>
          <span>Pendientes: {tasks.filter((t) => t.completed === 0).length}</span>
          <span>Completadas: {tasks.filter((t) => t.completed === 1).length}</span>
        </div>

        <div style={styles.controls}>
          <input
            type="text"
            placeholder="🔍 Buscar tarea..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.search}
          />
          <button style={styles.deleteAllBtn} onClick={() => setShowModal(true)}>
            Eliminar todas
          </button>
        </div>

        <div style={styles.filters}>
          <button style={filter === "all" ? styles.activeFilter : styles.filterBtn} onClick={() => setFilter("all")}>Todas</button>
          <button style={filter === "pending" ? styles.activeFilter : styles.filterBtn} onClick={() => setFilter("pending")}>Pendientes</button>
          <button style={filter === "completed" ? styles.activeFilter : styles.filterBtn} onClick={() => setFilter("completed")}>Completadas</button>
        </div>

        <div style={styles.form}>
          <input
            type="text"
            placeholder="Escribe una nueva tarea..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />
          <button style={styles.addBtn} onClick={addTask}>Agregar</button>
        </div>

        {loading && <div style={styles.spinner}>Cargando...</div>}

        {!loading && filteredTasks.length === 0 && <p style={styles.emptyMsg}>No hay tareas para mostrar.</p>}

        <ul style={styles.list}>
          {filteredTasks.map((task) => (
            <li key={task.id} style={styles.item}>
              <input type="checkbox" checked={task.completed === 1} onChange={() => toggleTask(task)} />
              {editId === task.id ? (
                <>
                  <input
                    style={styles.editInput}
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    data-testid="edit-input"
                  />
                  <button style={styles.saveBtn} onClick={saveEdit} data-testid="save-btn">Guardar</button>
                  <button style={styles.cancelBtn} onClick={() => { setEditId(null); setEditTitle(""); }}>Cancelar</button>
                </>
              ) : (
                <>
                  <span style={{ ...styles.text, textDecoration: task.completed ? "line-through" : "none" }}>{task.title}</span>
                  <button style={styles.editBtn} onClick={() => { setEditId(task.id); setEditTitle(task.title); }}>Editar</button>
                  <button style={styles.deleteBtn} onClick={() => deleteTask(task.id)}>✖</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>¿Eliminar todas las tareas?</h3>
            <p>Esta acción no se puede deshacer.</p>
            <div style={styles.modalBtns}>
              <button style={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancelar</button>
              <button style={styles.confirmBtn} onClick={deleteAll}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---- ESTILOS PROFESIONALES ---- */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f0f2f5",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "40px 0",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    background: "#d2eb52ff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    width: "450px",
  },
  title: {
    textAlign: "center",
    fontSize: "28px",
    marginBottom: "15px",
    color: "#333",
  },
  stats: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "20px",
    fontWeight: "bold",
    color: "#555",
  },
  controls: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
    alignItems: "center",
  },
  search: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  deleteAllBtn: {
    background: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 15px",
    cursor: "pointer",
  },
  filters: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  filterBtn: {
    flex: 1,
    margin: "0 5px",
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #3498db",
    background: "#fff",
    color: "#3498db",
    cursor: "pointer",
  },
  activeFilter: {
    flex: 1,
    margin: "0 5px",
    padding: "8px",
    borderRadius: "8px",
    border: "none",
    background: "#3498db",
    color: "#fff",
  },
  form: { display: "flex", marginBottom: "20px", gap: "10px" },
  input: { flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #ccc" },
  addBtn: { padding: "10px 15px", borderRadius: "8px", border: "none", background: "#2ecc71", color: "#fff", cursor: "pointer" },
  list: { listStyle: "none", padding: 0, margin: 0 },
  item: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px", borderBottom: "1px solid #eee" },
  text: { flex: 1, marginLeft: "10px" },
  editBtn: { background: "#3498db", color: "#fff", border: "none", borderRadius: "8px", padding: "5px 10px", cursor: "pointer", marginRight: "5px" },
  deleteBtn: { background: "#e74c3c", color: "#fff", border: "none", borderRadius: "8px", padding: "5px 10px", cursor: "pointer" },
  editInput: { flex: 1, padding: "6px", marginRight: "5px", borderRadius: "6px", border: "1px solid #ccc" },
  saveBtn: { background: "#2ecc71", color: "#fff", border: "none", borderRadius: "6px", padding: "5px 10px", cursor: "pointer", marginRight: "5px" },
  cancelBtn: { background: "#95a5a6", color: "#fff", border: "none", borderRadius: "6px", padding: "5px 10px", cursor: "pointer" },
  modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center" },
  modal: { background: "#fff", padding: "20px", borderRadius: "12px", width: "300px", textAlign: "center", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" },
  modalBtns: { display: "flex", justifyContent: "space-between", marginTop: "20px" },
  confirmBtn: { background: "#e74c3c", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 15px", cursor: "pointer" },
  emptyMsg: { textAlign: "center", color: "#777", marginTop: "20px" },
  spinner: { textAlign: "center", padding: "20px", color: "#3498db" },
};

export default App;
