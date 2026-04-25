# Модуль 26: CORS — связка фронтенда и бэкенда

## 🎯 Цель модуля

Понять что такое CORS, почему браузер блокирует запросы и как это исправить.

---

## 📚 Теория

### Проблема: браузер блокирует запросы между разными портами

Если фронтенд на одном порту, а бэкенд на другом — браузер заблокирует запросы:

```
Frontend: http://localhost:5173  ─┐
                                  │ ❌ Blocked by CORS
Backend:  http://localhost:3000  ─┘
```

Это называется **Same-Origin Policy**. Origin = протокол + домен + порт. Разные порты = разные origin = блокировка.

### Решение: CORS-заголовки

Сервер должен явно сказать: «я разрешаю запросы отовсюду». Для этого добавляются специальные заголовки:

```javascript
res.setHeader('Access-Control-Allow-Origin', '*');           // кто может обращаться (* = все)
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');  // какие методы
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');               // какие заголовки
```

### Preflight-запросы (OPTIONS)

Перед «сложными» запросами (POST с JSON, DELETE) браузер автоматически отправляет предварительный запрос методом `OPTIONS` — «можно ли?». Сервер должен ответить CORS-заголовками и статусом 204:

```
1. Браузер → OPTIONS /api/users   (можно ли POST?)
2. Сервер  → 204 + CORS headers   (да, можно)
3. Браузер → POST /api/users       (основной запрос)
4. Сервер  → 201 + data
```

```javascript
if (req.method === 'OPTIONS') {
  // Добавить CORS-заголовки
  res.statusCode = 204;  // No Content
  res.end();
  return;
}
```

---

## 💡 Примеры

### Пример: Сервер с CORS и обработкой OPTIONS

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  // CORS-заголовки для ВСЕХ ответов
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight — ответить и выйти
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  // Обычные запросы
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ message: 'Hello from API!' }));
});
```

---

## ✏️ Задание

### Описание

Создайте функции для работы с CORS и сервер, доступный с любого origin.

1. `addCorsHeaders(res)` — добавляет CORS-заголовки к ответу
2. `handlePreflight(req, res)` — обрабатывает OPTIONS запрос
3. `createServer()` — сервер с CORS и простым API

### Требования

1. `addCorsHeaders(res)`:
   - Добавляет `Access-Control-Allow-Origin: *`
   - Добавляет `Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS`
   - Добавляет `Access-Control-Allow-Headers: Content-Type`

2. `handlePreflight(req, res)`:
   - Если `req.method === 'OPTIONS'`:
     - Вызывает `addCorsHeaders(res)`
     - Устанавливает статус 204
     - Завершает ответ
     - Возвращает `true`
   - Иначе возвращает `false`

3. `createServer()` — сервер:
   - Использует `handlePreflight` для OPTIONS
   - Добавляет CORS-заголовки ко всем ответам
   - `GET /api/message` → `{ message: "Hello from API" }`
   - `POST /api/echo` → возвращает полученный body
   - Остальное → 404

### Примеры

```javascript
// OPTIONS /api/message → 204 (no content) + CORS headers

// GET /api/message → { message: "Hello from API" }

// POST /api/echo с body { data: "test" }
// → { data: "test" }

// Все ответы содержат заголовок:
// Access-Control-Allow-Origin: *
```

---

## 💭 Подсказки

<details>
<summary>Подсказка 1: Направление</summary>

Какие три HTTP-заголовка нужно установить для разрешения кросс-доменных запросов? Почему браузер перед «сложным» запросом (POST с JSON) сначала отправляет запрос методом OPTIONS, и как сервер должен на него ответить?
</details>

<details>
<summary>Подсказка 2: Структура</summary>

Разбейте задачу на три функции с чёткими обязанностями. Первая функция устанавливает три CORS-заголовка через `res.setHeader`. Вторая проверяет метод запроса и, если это preflight, вызывает первую функцию, отвечает без тела и сообщает вызывающему коду, что запрос обработан (через возвращаемое значение `true`/`false`). Третья создаёт сервер, в начале обработки каждого запроса проверяет preflight, затем добавляет CORS-заголовки, и дальше маршрутизирует по method/url.

</details>

<details>
<summary>Подсказка 3: Подход</summary>

`addCorsHeaders` — установите три заголовка: `Access-Control-Allow-Origin` со значением `*`, `Access-Control-Allow-Methods` со списком разрешённых методов (GET, POST, DELETE, OPTIONS) и `Access-Control-Allow-Headers` со значением `Content-Type`.

`handlePreflight` — проверьте, что метод равен `OPTIONS`. Если да — вызовите `addCorsHeaders`, установите статус 204, завершите ответ через `res.end()` и верните `true`. Иначе — верните `false`.

`createServer` — в обработчике сначала вызовите `handlePreflight` и при `true` — выйдите. Затем вызовите `addCorsHeaders` и установите `Content-Type: application/json`. Для GET на `/api/message` — верните JSON с полем `message`. Для POST на `/api/echo` — прочитайте body (используйте вспомогательную функцию из модуля 25 или аналогичную) и верните его как есть. Всё остальное — статус 404.

</details>

---

## 🧪 Как проверить решение

```bash
npx vitest module-26/index.spec.js
```

### Проверка в браузере

1. Запустите сервер: `node -e "require('./module-26/index.js').createServer().listen(3000)"`
2. Откройте любой сайт в браузере
3. В консоли выполните:
```javascript
fetch('http://localhost:3000/api/message')
  .then(r => r.json())
  .then(console.log)
// Должно работать без ошибок CORS!
```

---

## 📖 Дополнительные материалы

- [MDN: CORS](https://developer.mozilla.org/ru/docs/Web/HTTP/CORS)

---

## 🎓 Что дальше?

Переходите к **Модуль 27: TODO-приложение** — соберём полноценное приложение с фронтом и бэком.
