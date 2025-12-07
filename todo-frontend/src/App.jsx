import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import "./theme.css";

const API = "http://localhost:4000";

// ---------------- FORM ----------------
function TodoForm({ onAdd }) {
  const [title, setTitle] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const res = await axios.post(`${API}/todos`, { title: title.trim() });
    onAdd(res.data);
    setTitle("");
  };

  return (
    <form className="todo-form" onSubmit={submit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add new task..."
        className="todo-input"
      />
      <button type="submit" className="btn add-btn">
        Add
      </button>
    </form>
  );
}

// ---------------- ITEM ----------------
function TodoItem({ todo, onToggle, onDelete, onStartEdit }) {
  return (
    <li className="todo-item">
      <div className="left">
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => onToggle(todo)}
        />
        <span className={todo.done ? "done" : ""}>{todo.title}</span>
      </div>

      <div className="right">
        <button onClick={() => onStartEdit(todo)} className="icon-btn edit">
          ✏️
        </button>
        <button onClick={() => onDelete(todo._id)} className="icon-btn delete">
          🗑️
        </button>
      </div>
    </li>
  );
}

// ---------------- MODAL ----------------
function EditModal({ todo, onClose, onSave }) {
  const [title, setTitle] = useState(todo.title);

  const save = async () => {
    if (!title.trim()) return;
    const res = await axios.put(`${API}/todos/${todo._id}`, {
      title: title.trim(),
    });
    onSave(res.data);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>
          <stronng>Edit Task</stronng>
        </h3>

        <input
          className="modal-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="modal-actions">
          <button className="btn save-btn" onClick={save}>
            Save
          </button>
          <button className="btn cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------- MAIN APP ----------------
export default function App() {
  const [todos, setTodos] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    axios.get(`${API}/todos`).then((r) => setTodos(r.data));
  }, []);

  const add = (t) => setTodos((prev) => [t, ...prev]);

  const toggle = async (t) => {
    const res = await axios.put(`${API}/todos/${t._id}`, { done: !t.done });
    setTodos((prev) => prev.map((p) => (p._id === t._id ? res.data : p)));
  };

  const remove = async (id) => {
    await axios.delete(`${API}/todos/${id}`);
    setTodos((prev) => prev.filter((p) => p._id !== id));
  };

  const saveEdit = (updated) => {
    setTodos((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
    setEditing(null);
  };

  return (
    <div className="app-container">
      <h1 className="title">Todo App</h1>

      <TodoForm onAdd={add} />

      <ul className="todo-list">
        {todos.map((t) => (
          <TodoItem
            key={t._id}
            todo={t}
            onToggle={toggle}
            onDelete={remove}
            onStartEdit={setEditing}
          />
        ))}
      </ul>

      {editing && (
        <EditModal
          todo={editing}
          onClose={() => setEditing(null)}
          onSave={saveEdit}
        />
      )}
    </div>
  );
}
