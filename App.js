import { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc
} from "firebase/firestore";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const tasksRef = collection(db, "tasks");

  const addTask = async (e) => {
    e.preventDefault();
    if (task.trim()) {
      await addDoc(tasksRef, { text: task });
      setTask("");
    }
  };

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(tasksRef, (snapshot) => {
      const updatedTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(updatedTasks);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="app">
      <h1>☁️ Cloud To-Do List</h1>

      <form onSubmit={addTask} className="task-form">
        <input
          type="text"
          placeholder="Add a new task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button type="submit">➕</button>
      </form>

      <ul className="task-list">
        {tasks.map((t) => (
          <li key={t.id}>
            {t.text}
            <button onClick={() => deleteTask(t.id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
