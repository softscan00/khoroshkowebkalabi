# Модуль 23: Создание HTTP-сервера

## 🎯 Цель модуля

Научиться создавать свой HTTP-сервер на Node.js и обрабатывать запросы.

---

## 📚 Теория

### Что такое сервер?

**Сервер** — программа, которая слушает порт и отвечает на входящие запросы.

```
Браузер                         Сервер
   │                               │
   │── GET /api/users ───────────→ │
   │                               │ (обработка)
   │←─ { users: [...] } ──────────│
   │                               │
```

### Модуль http в Node.js

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  // req — входящий запрос
  // res — ответ, который мы отправляем

  res.end('Hello World!');
});

server.listen(3000, () => {
  console.log('Сервер запущен: http://localhost:3000');
});
```

### Объект Request (req)

```javascript
req.method   // 'GET', 'POST', 'PUT', 'DELETE'
req.url      // '/api/users', '/about?page=1'
req.headers  // { 'content-type': 'application/json', ... }
```

### Объект Response (res)

```javascript
// Установить статус-код
res.statusCode = 200;

// Установить заголовок (тип содержимого)
res.setHeader('Content-Type', 'application/json');

// Отправить ответ и закрыть соединение
res.end(JSON.stringify({ message: 'OK' }));
```

Для JSON-ответа нужны два шага: установить заголовок `Content-Type` и сериализовать данные через `JSON.stringify`.

### Обработка разных путей

```javascript
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.end('Главная страница');
  } else if (req.url === '/about') {
    res.end('О нас');
  } else {
    res.statusCode = 404;
    res.end('Страница не найдена');
  }
});
```

---

## 💡 Примеры

### Пример 1: Минимальный сервер

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.end('Hello from server!');
});

server.listen(3000);
// Открой http://localhost:3000 в браузере
```

### Пример 2: JSON API

```javascript
const http = require('http');

const users = [
  { id: 1, name: 'Ivan' },
  { id: 2, name: 'Maria' }
];

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/api/users') {
    res.end(JSON.stringify(users));
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(3000);
```

---

## ✏️ Задание

### Описание

Создайте функцию `createServer()`, которая возвращает настроенный HTTP-сервер с несколькими эндпоинтами.

### Требования

Функция `createServer()` должна вернуть `http.Server` с обработкой:

1. `GET /` — возвращает `{ message: "Welcome to API" }`
2. `GET /api/health` — возвращает `{ status: "ok" }`
3. `GET /api/time` — возвращает `{ time: <текущее время ISO> }`
4. Любой другой путь — статус 404 и `{ error: "Not found" }`

**Все ответы:**
- Content-Type: `application/json`
- Тело — валидный JSON

### Примеры

```javascript
const server = createServer();
server.listen(3000);

// GET http://localhost:3000/
// → { "message": "Welcome to API" }

// GET http://localhost:3000/api/health
// → { "status": "ok" }

// GET http://localhost:3000/api/time
// → { "time": "2024-01-15T10:30:00.000Z" }

// GET http://localhost:3000/unknown
// → 404 { "error": "Not found" }
```

---

## 💭 Подсказки

<details>
<summary>Подсказка 1: Направление</summary>

Какой метод модуля `http` создаёт сервер? Как через объект `req` определить, какой путь запросил клиент? Подумайте, как с помощью условий направить ответ в зависимости от пути.
</details>

<details>
<summary>Подсказка 2: Структура</summary>

Функция должна вернуть результат вызова `http.createServer`, передав ему callback с `req` и `res`. Внутри callback установите заголовок ответа для JSON, затем через цепочку условий (`if/else if`) проверяйте `req.url` и отправляйте соответствующий JSON-ответ через `res.end()`.

</details>

<details>
<summary>Подсказка 3: Подход</summary>

Создайте сервер через `http.createServer`. В обработчике первым делом установите `Content-Type: application/json` для всех ответов. Затем проверяйте `req.url`: для `/` верните JSON с полем `message`, для `/api/health` — JSON с полем `status`, для `/api/time` — JSON с полем `time`, значение которого можно получить через `new Date().toISOString()`. Для всех остальных путей установите `res.statusCode` в 404 и верните JSON с полем `error`. Каждый ответ сериализуйте через `JSON.stringify` и отправляйте через `res.end()`.

</details>

---

## 🧪 Как проверить решение

```bash
npx vitest module-23/index.spec.js
```

### Ручная проверка

```bash
# В одном терминале
node -e "require('./module-23/index.js').createServer().listen(3000)"

# В другом терминале
curl http://localhost:3000/
curl http://localhost:3000/api/health
curl http://localhost:3000/api/time
curl http://localhost:3000/unknown
```

---

## 📖 Дополнительные материалы

- [Node.js: HTTP](https://nodejs.org/docs/latest/api/http.html)

---

## ❓ Частые вопросы

**Q: Что такое порт?**

A: Номер (1-65535), по которому программа принимает соединения. Для разработки обычно используют 3000 или 8080.

**Q: Почему нужен Content-Type?**

A: Клиент должен знать, как интерпретировать ответ. `application/json` говорит — это JSON, парси как объект.

---

## 🎓 Что дальше?

Переходите к **Модуль 24: Routing и параметры** — научитесь обрабатывать динамические пути и query-параметры.
