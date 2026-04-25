# Модуль 31: React + Fetch (получение данных)

## 🎯 Цель модуля

Научиться загружать данные с сервера в React-компоненты через useEffect и fetch.

---

## 📚 Теория

### Проблема: когда загружать данные?

Компонент рендерится **мгновенно**, а данные приходят **позже**. Нужен механизм:

```
1. Компонент рендерится → "Загрузка..."
2. useEffect → fetch('/api/data')
3. Данные получены → setState → перерендер
4. Компонент показывает данные
```

### useEffect

Выполняет код **после** рендера:

```jsx
import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Выполнится после первого рендера
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []); // [] — только один раз при монтировании

  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}
```

### Состояния загрузки

```jsx
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/users')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}
```

### Форма + POST запрос

```jsx
function AddUser() {
  const [name, setName] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });

    setName(''); // Очистить
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Имя"
      />
      <button type="submit">Добавить</button>
    </form>
  );
}
```

### async/await в useEffect

```jsx
useEffect(() => {
  // Нельзя: useEffect(() => async ...)
  // Нужно создать async функцию внутри:

  async function loadData() {
    const res = await fetch('/api/data');
    const data = await res.json();
    setData(data);
  }

  loadData();
}, []);
```

---

## 💡 Примеры

### Пример: Удаление из списка

```jsx
function TodoApp() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch('/api/todos')
      .then(res => res.json())
      .then(setTodos);
  }, []);

  async function handleDelete(id) {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    setTodos(todos.filter(t => t.id !== id));
  }

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          {todo.title}
          <button onClick={() => handleDelete(todo.id)}>×</button>
        </li>
      ))}
    </ul>
  );
}
```

---

## ✏️ Задание

### Описание

Создайте два React-компонента, работающих с API:

1. `PostList` — загружает и отображает список постов
2. `AddPostForm` — форма для создания поста

### Требования

1. `PostList({ url })`:
   - Принимает `url` — базовый URL для API
   - При монтировании загружает `GET {url}/api/posts`
   - Показывает три состояния:
     - Загрузка: `<p data-testid="loading">Загрузка...</p>`
     - Ошибка: `<p data-testid="error">Ошибка: {message}</p>`
     - Данные: `<ul data-testid="posts">` с `<li>` для каждого поста
   - Каждый `<li>` содержит `post.title`

2. `AddPostForm({ url, onAdd })`:
   - Принимает `url` и колбэк `onAdd`
   - Содержит `<input>` с `placeholder="Заголовок поста"`
   - Содержит `<button type="submit">Добавить</button>`
   - При сабмите:
     - POST `{url}/api/posts` с body `{ title }`
     - Вызывает `onAdd(newPost)` с ответом сервера
     - Очищает input

### Примеры

```jsx
<PostList url="http://localhost:3000" />
// 1. Показывает "Загрузка..."
// 2. Загружает GET http://localhost:3000/api/posts
// 3. Показывает список постов

<AddPostForm
  url="http://localhost:3000"
  onAdd={(post) => console.log('Создан:', post)}
/>
// Форма с input и кнопкой
// При сабмите — POST запрос + колбэк
```

---

## 💭 Подсказки

<details>
<summary>Подсказка 1: Направление</summary>

Для `PostList` вам нужны три состояния: данные, загрузка и ошибка. Загрузка данных происходит в `useEffect` при монтировании компонента. Как проверить, что HTTP-ответ успешный, прежде чем вызвать `.json()`?
</details>

<details>
<summary>Подсказка 2: Структура</summary>

`PostList` использует три состояния: массив постов, флаг загрузки и строку ошибки. В `useEffect` (с массивом зависимостей) выполняется fetch. Перед вызовом `.json()` проверяйте `res.ok` — если ответ неуспешный, бросайте ошибку. В `.then` обновляйте состояния, в `.catch` — сохраняйте сообщение об ошибке. Рендеринг зависит от текущего состояния: загрузка, ошибка или список.

`AddPostForm` — контролируемый input со состоянием для текста. При submit — отправка POST-запроса и вызов колбэка.

</details>

<details>
<summary>Подсказка 3: Подход</summary>

`PostList`: создайте три `useState` — для постов (начально `[]`), загрузки (начально `true`) и ошибки (начально `null`). В `useEffect` с зависимостью `[url]` делайте fetch на `{url}/api/posts`. В цепочке промисов: проверьте `res.ok`, если нет — бросьте `new Error` с текстом вроде `HTTP {status}`. При успехе — установите посты и сбросьте загрузку в `false`. В catch — установите ошибку и сбросьте загрузку. При рендеринге: если `loading` — верните `<p>` с data-testid="loading" и текстом "Загрузка...". Если `error` — `<p>` с data-testid="error" и сообщением. Иначе — `<ul>` с data-testid="posts", где каждый пост маппится в `<li>` с `key` и заголовком.

`AddPostForm`: храните введённый текст в `useState`. При отправке формы — `preventDefault`, сделайте POST-запрос на `{url}/api/posts` с заголовком `Content-Type: application/json` и телом с полем `title`. Получите ответ, распарсите JSON и передайте результат в колбэк `onAdd`. Очистите поле ввода, установив пустую строку.

</details>

---

## 🧪 Как проверить решение

```bash
npx vitest module-31/index.spec.jsx
```

---

## 📖 Дополнительные материалы

- [React: useEffect](https://react.dev/reference/react/useEffect)

---

## 🎓 Что дальше?

Переходите к **Модуль 32: Финальный проект** — соберёте всё вместе!
