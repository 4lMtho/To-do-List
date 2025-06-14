// src/App.js
import { useEffect, useState } from "react";
import { collection, addDoc, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "tasks"), (snapshot) => {
      setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, []);

  const addTask = async () => {
    if (input.trim()) {
      await addDoc(collection(db, "tasks"), { text: input });
      setInput("");
    }
  };

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">To-Do List</h1>
      <div className="flex mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 flex-grow"
          placeholder="Enter a task"
        />
        <button onClick={addTask} className="ml-2 px-4 bg-blue-500 text-white">Add</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="flex justify-between border-b py-2">
            {task.text}
            <button onClick={() => deleteTask(task.id)} className="text-red-500">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
