/**
 * Модуль 32: Финальный проект — Frontend (React)
 *
 * Задание: Компоненты для приложения заметок.
 */

import { useState, useEffect } from 'react';

/**
 * NoteList — список заметок
 *
 * @param {Object} props
 * @param {Array} props.notes - массив заметок { id, title, text }
 *
 * Рендерит <ul data-testid="note-list">
 * Каждая заметка: <li data-testid="note-item"> с <h3>title</h3> и <p>text</p>
 */
export function NoteList({ notes }) {
  return (
    <ul data-testid="note-list">
      {notes.map(note => (
        <li key={note.id} data-testid="note-item">
          <h3>{note.title}</h3>
          <p>{note.text}</p>
        </li>
      ))}
    </ul>
  );
}


/**
 * AddNoteForm — форма добавления заметки
 *
 * @param {Object} props
 * @param {Function} props.onAdd - колбэк onAdd({ title, text })
 *
 * Два input: placeholder="Заголовок" и placeholder="Текст заметки"
 * При сабмите: вызвать onAdd, очистить поля
 */
export function AddNoteForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !text.trim()) return;
    onAdd({ title, text });
    setTitle('');
    setText('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Заголовок"
      />
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Текст заметки"
      />
      <button type="submit">Добавить</button>
    </form>
  );
}


/**
 * App — главный компонент
 *
 * @param {Object} props
 * @param {string} props.url - базовый URL сервера
 *
 * При монтировании: GET {url}/api/notes
 * Загрузка: <p data-testid="loading">Загрузка...</p>
 * Содержит AddNoteForm + NoteList
 * При добавлении: POST {url}/api/notes, обновить список
 */
export function App({ url }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotes() {
      try {
        const res = await fetch(`${url}/api/notes`);
        const data = await res.json();
        setNotes(data);
      } finally {
        setLoading(false);
      }
    }
    loadNotes();
  }, [url]);

  async function handleAddNote({ title, text }) {
    const res = await fetch(`${url}/api/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, text })
    });
    const newNote = await res.json();
    setNotes(prev => [...prev, newNote]);
  }

  if (loading) {
    return <p data-testid="loading">Загрузка...</p>;
  }

  return (
    <div>
      <AddNoteForm onAdd={handleAddNote} />
      <NoteList notes={notes} />
    </div>
  );
}
