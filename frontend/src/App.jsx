import { useEffect, useState } from 'react';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  const load = async () => {
    const res = await fetch('/api/tasks');
    setTasks(await res.json());
  };
  useEffect(() => { load(); }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    setTitle('');
    load();
  };

  const toggle = async (t) => {
    await fetch(`/api/tasks/${t._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: t.status === 'completed' ? 'pending' : 'completed' }),
    });
    load();
  };

  const remove = async (id) => {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Task Manager</h1>
      <form onSubmit={addTask}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New task" />
        <button type="submit">Add</button>
      </form>
      <ul>
        {tasks.map((t) => (
          <li key={t._id}>
            <span
              onClick={() => toggle(t)}
              style={{ cursor: 'pointer', textDecoration: t.status === 'completed' ? 'line-through' : 'none' }}
            >
              {t.title}
            </span>{' '}
            <button onClick={() => remove(t._id)}>x</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
