# Модуль 27: TODO-приложение (Fullstack)

## 🎯 Цель модуля

Собрать полноценное TODO-приложение: бэкенд (API) + фронтенд (интерфейс).

---

## 📚 Теория

### Архитектура приложения

```
┌────────────────────┐         ┌────────────────────┐
│     Frontend       │  fetch  │     Backend        │
│  (index.html)      │ ──────→ │  (server.js)       │
│                    │         │                    │
│  - форма ввода     │ ←────── │  - GET /api/todos  │
│  - список задач    │  JSON   │  - POST /api/todos │
│  - кнопки          │         │  - PATCH /.../:id  │
│                    │         │  - DELETE /.../:id  │
└────────────────────┘         └────────────────────┘
     Браузер                        Node.js
```

### Fullstack = Frontend + Backend

| Часть | Файл | Технологии |
|-------|------|------------|
| Backend | `server.js` | http, JSON, CORS |
| Frontend | `app.js` | fetch, DOM, события |
| Страница | `index.html` | HTML, CSS (готов) |

### REST API для TODO

| Метод | URL | Описание | Body | Ответ |
|-------|-----|----------|------|-------|
| GET | /api/todos | Список | — | `[{id, title, completed}]` |
| POST | /api/todos | Создать | `{title}` | `{id, title, completed}` |
| PATCH | /api/todos/:id | Переключить | — | `{id, title, completed}` |
| DELETE | /api/todos/:id | Удалить | — | 204 |

### Структура TODO

```javascript
{
  id: 1,
  title: "Купить молоко",
  completed: false
}
```

---

## 💡 Примеры

### Пример 1: API-запрос с фронта

```javascript
// Получить все задачи
async function fetchTodos() {
  const response = await fetch('http://localhost:3000/api/todos');
  return await response.json();
}

// Создать задачу
async function addTodo(title) {
  const response = await fetch('http://localhost:3000/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  return await response.json();
}
```

### Пример 2: Рендер списка

```javascript
function renderTodos(todos, container) {
  container.innerHTML = '';

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.textContent = todo.title;

    if (todo.completed) {
      li.style.textDecoration = 'line-through';
    }

    container.appendChild(li);
  });
}
```

---

## ✏️ Задание

### Часть 1: Backend (server.js)

Создайте функцию `createServer()`, которая возвращает HTTP-сервер с TODO API.

**Эндпоинты:**

1. `GET /api/todos` — массив всех задач
2. `POST /api/todos` — создать задачу (body: `{ title }`)
   - Ответ: 201 + `{ id, title, completed: false }`
3. `PATCH /api/todos/:id` — переключить `completed` (true↔false)
   - Ответ: обновлённая задача
   - Если не найдена: 404
4. `DELETE /api/todos/:id` — удалить задачу
   - Ответ: 204
   - Если не найдена: 404
5. Остальное → 404
6. **CORS** — все ответы с заголовком `Access-Control-Allow-Origin: *`

### Часть 2: Frontend (app.js)

Напишите функции для работы с API и DOM:

1. `fetchTodos(baseUrl)` — GET запрос, возвращает массив задач
2. `addTodo(baseUrl, title)` — POST запрос, возвращает созданную задачу
3. `toggleTodo(baseUrl, id)` — PATCH запрос, возвращает обновлённую задачу
4. `deleteTodo(baseUrl, id)` — DELETE запрос, возвращает `true`
5. `renderTodos(todos, container)` — рисует задачи в DOM:
   - Каждая задача — `<li>` внутри контейнера
   - Текст задачи внутри `<span>` с классом `todo-title`
   - Если `completed` — у `<li>` добавляется класс `completed`
   - Кнопка удаления — `<button>` с классом `delete-btn` и текстом `"×"`
   - **Важно:** текст кнопки удаления должен быть символом `×` (Unicode U+00D7, multiplication sign), а НЕ обычной латинской буквой `x`
   - Для интерактивной HTML-версии полезно добавлять атрибут `data-id` на элементы `<li>`, чтобы связать DOM-элемент с конкретной задачей

### Примеры

```javascript
// Backend
// POST /api/todos + { title: "Купить молоко" }
// → 201 { id: 1, title: "Купить молоко", completed: false }

// PATCH /api/todos/1
// → 200 { id: 1, title: "Купить молоко", completed: true }

// Frontend
const todos = await fetchTodos('http://localhost:3000');
// [{ id: 1, title: "Купить молоко", completed: true }]

renderTodos(todos, document.getElementById('todo-list'));
// <li class="completed">
//   <span class="todo-title">Купить молоко</span>
//   <button class="delete-btn">×</button>
// </li>
```

---

## 💭 Подсказки

<details>
<summary>Подсказка 1: Направление</summary>

Сервер должен поддерживать 4 HTTP-метода (GET, POST, PATCH, DELETE) и CORS. Подумайте, как организовать маршрутизацию по комбинации `req.method` и `req.url`. На фронтенде — как через `fetch` отправить запрос с определённым методом и как создать DOM-элементы для списка задач?
</details>

<details>
<summary>Подсказка 2: Структура</summary>

**server.js:** Сервер хранит массив задач и счётчик id в замыкании. В начале каждого запроса — CORS-заголовки и обработка OPTIONS. Далее маршрутизация по четырём комбинациям method + url. Для PATCH и DELETE id извлекается из последней части URL. PATCH инвертирует поле `completed`, DELETE удаляет элемент из массива.

**app.js:** API-функции — это обёртки над `fetch` с нужным методом и URL. Каждая возвращает результат из `response.json()`. Функция `renderTodos` очищает контейнер и для каждой задачи создаёт `<li>`, содержащий `<span>` с текстом и `<button>` для удаления. Используйте `document.createElement` для создания элементов.

</details>

<details>
<summary>Подсказка 3: Подход</summary>

**server.js:** Для GET — отдайте весь массив. Для POST — прочитайте body, извлеките `title`, создайте объект с `id`, `title` и `completed: false`, добавьте в массив, ответьте со статусом 201. Для PATCH — получите id из URL (вырежьте строку после `/api/todos/` и преобразуйте в число), найдите задачу через `find`, инвертируйте `completed` через `!`, верните задачу (или 404). Для DELETE — аналогично найдите индекс через `findIndex`, удалите через `splice`, ответьте 204 (или 404).

**app.js:** `fetchTodos` делает GET на `{baseUrl}/api/todos` и возвращает распарсенный JSON. `addTodo` делает POST с заголовком `Content-Type: application/json` и телом с `title`. `toggleTodo` делает PATCH на `{baseUrl}/api/todos/{id}`. `deleteTodo` делает DELETE на тот же URL и возвращает `true`. В `renderTodos` — для каждой задачи создайте `<li>` (с классом `completed`, если задача завершена), внутри `<span class="todo-title">` с текстом и `<button class="delete-btn">` с символом `\u00D7`. Добавляйте элементы через `appendChild`.

</details>

---

## 🧪 Как проверить решение

```bash
npx vitest module-27/index.spec.js
```

### Интерактивная проверка

```bash
# Запустите сервер
node module-27/start.js

# Откройте в браузере
# http://localhost:3000
```

---

## 📖 Дополнительные материалы

- [MDN: Fetch API](https://developer.mozilla.org/ru/docs/Web/API/Fetch_API)

---

## 🎓 Что дальше?

Переходите к **Модуль 28: Работа с файлами** — научитесь сохранять данные на диск.
