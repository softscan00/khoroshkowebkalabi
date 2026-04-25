# Модуль 25: POST-запросы и тело запроса

## 🎯 Цель модуля

Научиться принимать данные от клиента через POST-запросы и обрабатывать тело запроса.

---

## 📚 Теория

### Как приходят данные в POST-запросе

В отличие от GET, POST-запрос содержит **тело (body)** — данные от клиента:

```
POST /api/users HTTP/1.1
Content-Type: application/json

{"name": "Ivan", "email": "ivan@mail.ru"}
```

### Чтение body в Node.js

Body приходит не сразу, а **частями (chunks)** через поток. Нужно подписаться на события потока, собрать все части и дождаться завершения:

```javascript
let body = '';

req.on('data', (chunk) => {   // каждая часть данных
  body += chunk;
});

req.on('end', () => {         // все данные получены
  const data = JSON.parse(body);
  console.log(data);  // { name: 'Ivan', email: 'ivan@mail.ru' }
});
```

### Оборачивание в Promise

Работать с событиями напрямую неудобно. Обернём в Promise, чтобы использовать `await`:

```javascript
function getBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

// Теперь можно так:
const data = await getBody(req);
// { name: 'Ivan' }
```

### CRUD — четыре операции с данными

| Метод | Действие | Статус ответа |
|-------|----------|---------------|
| GET | Получить | 200 |
| POST | Создать | 201 (Created) |
| DELETE | Удалить | 204 (No Content) |

---

## 💡 Примеры

> `getBody` в примере — это **наша функция** из раздела выше (оборачивание чтения body в Promise).

### Пример: Сервер с GET и POST

```javascript
let users = [];
let nextId = 1;

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  // GET /api/users — вернуть список
  if (req.method === 'GET' && req.url === '/api/users') {
    res.end(JSON.stringify(users));
    return;
  }

  // POST /api/users — создать пользователя
  if (req.method === 'POST' && req.url === '/api/users') {
    const { name } = await getBody(req);  // читаем body
    const user = { id: nextId++, name };
    users.push(user);

    res.statusCode = 201;
    res.end(JSON.stringify(user));
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'Not found' }));
});
```

---

## ✏️ Задание

### Описание

Создайте функцию для чтения body и сервер с полным CRUD API.

1. `getBody(req)` — читает и парсит JSON из запроса
2. `createServer()` — сервер с CRUD для пользователей

### Требования

1. `getBody(req)`:
   - Возвращает Promise
   - Собирает chunks через `req.on('data')`
   - Парсит JSON в `req.on('end')`
   - При ошибке парсинга — reject

2. `createServer()` — API:
   - `GET /api/users` — массив пользователей
   - `POST /api/users` — создать (body: `{ name }`) → 201 + новый user
   - `DELETE /api/users/:id` — удалить → 204 или 404
   - Остальное → 404

Структура пользователя: `{ id: number, name: string }`

### Примеры

```javascript
// getBody
const body = await getBody(req);
// { name: "Ivan" }

// POST /api/users с body { name: "Ivan" }
// → 201 { id: 1, name: "Ivan" }

// POST /api/users с body { name: "Maria" }
// → 201 { id: 2, name: "Maria" }

// GET /api/users
// → [{ id: 1, name: "Ivan" }, { id: 2, name: "Maria" }]

// DELETE /api/users/1
// → 204 (no content)

// GET /api/users
// → [{ id: 2, name: "Maria" }]

// DELETE /api/users/999
// → 404 { error: "User not found" }
```

---

## 💭 Подсказки

<details>
<summary>Подсказка 1: Направление</summary>

Данные в POST-запросе приходят частями (chunks) через поток. Какие события потока нужно слушать, чтобы собрать все части и узнать, когда передача завершена? Как обернуть этот асинхронный процесс в Promise?
</details>

<details>
<summary>Подсказка 2: Структура</summary>

Функция `getBody` должна вернуть Promise, внутри которого вы подписываетесь на события потока (`data` и `end`). Накапливайте строку из чанков, а когда поток завершится — парсите результат как JSON. Оберните парсинг в `try/catch`, чтобы при некорректном JSON промис отклонялся.

Для сервера — храните массив пользователей и счётчик `nextId` в замыкании `createServer`. Маршрутизация строится на проверке комбинации `req.method` и `req.url`. Для DELETE id нужно извлечь из URL.

</details>

<details>
<summary>Подсказка 3: Подход</summary>

Для `getBody`: создайте Promise, внутри заведите пустую строку. На каждый `data`-чанк — конкатенируйте к строке. На `end` — вызовите `JSON.parse` внутри try/catch, при успехе — resolve, при ошибке — reject.

Для `createServer`: верните `http.createServer` с async-обработчиком. Установите заголовок `Content-Type: application/json` для всех ответов. Для GET по `/api/users` — сериализуйте массив и отдайте. Для POST по `/api/users` — вызовите `getBody`, создайте объект с `id` (из счётчика) и `name` из body, добавьте в массив, верните 201. Для DELETE — извлеките id из последнего сегмента URL через `split('/')`, найдите индекс через `findIndex`, удалите через `splice` и верните 204, либо 404 если не найден. Всё остальное — 404.

</details>

---

## 🧪 Как проверить решение

```bash
npx vitest module-25/index.spec.js
```

### Ручная проверка с curl

```bash
# Запустить сервер
node -e "require('./module-25/index.js').createServer().listen(3000)"

# В другом терминале:
# Создать пользователя
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Ivan"}'

# Получить список
curl http://localhost:3000/api/users

# Удалить
curl -X DELETE http://localhost:3000/api/users/1
```

---

## 📖 Дополнительные материалы

- [Node.js: HTTP](https://nodejs.org/docs/latest/api/http.html)

---

## 🎓 Что дальше?

Переходите к **Модуль 26: CORS** — научитесь связывать фронтенд и бэкенд на разных портах.
