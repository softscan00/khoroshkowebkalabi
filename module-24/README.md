# Модуль 24: Routing и параметры URL

## 🎯 Цель модуля

Научиться обрабатывать динамические пути (`/users/123`) и query-параметры (`?page=1`).

---

## 📚 Теория

### Структура URL

```
http://localhost:3000/api/users/5?sort=name&limit=10
└──────────────────┘└──────────┘└┘└────────────────┘
       origin          path     │   query string
                                │
                          параметр пути (id=5)
```

### Параметры пути (Path Parameters)

ID или другие данные прямо в URL:

```
/users/123      → id = 123
/users/5/posts  → userId = 5
```

Извлечь можно, проверив начало строки и взяв остаток:

```javascript
const pathname = '/users/123';

if (pathname.startsWith('/users/')) {
  const id = pathname.slice('/users/'.length);  // '123'
  const numId = parseInt(id);                    // 123
}
```

### Query-параметры

Параметры после `?` в URL:

```
/api/users?page=2&limit=10
```

Извлечение через встроенный класс `URL`:

```javascript
// Второй аргумент — фиктивный базовый URL (нужен для парсинга относительных путей)
const url = new URL('/api/users?page=2&limit=10', 'http://localhost');

url.pathname                    // '/api/users'
url.searchParams.get('page')    // '2' (строка!)
url.searchParams.get('limit')   // '10'
url.searchParams.get('foo')     // null (нет такого параметра)
```

### Превращение query в объект

```javascript
const url = new URL('/api/users?page=2&sort=name', 'http://localhost');

const query = Object.fromEntries(url.searchParams);
// { page: '2', sort: 'name' }
```

Все значения query — **строки**. Если нужно число, используйте `parseInt()`.

---

## 💡 Примеры

### Пример 1: Извлечение ID из пути

```javascript
const pathname = '/api/users/5';

if (pathname.startsWith('/api/users/')) {
  const idStr = pathname.slice('/api/users/'.length);  // '5'
  const id = parseInt(idStr);                           // 5

  if (!isNaN(id)) {
    const user = users.find(u => u.id === id);
    // { id: 5, name: 'Alex' }
  }
}
```

### Пример 2: Пагинация через query-параметры

Пагинация — это разбивка большого списка на «страницы». Клиент говорит: «дай мне страницу 2 по 2 элемента» (`?page=2&limit=2`).

**Как это работает:**

```
Массив:  [Ivan, Maria, Peter, Anna, Alex]
Индексы:   0      1      2      3     4

page=1, limit=2 → элементы 0..1  → [Ivan, Maria]
page=2, limit=2 → элементы 2..3  → [Peter, Anna]
page=3, limit=2 → элементы 4..5  → [Alex]
```

Формула: `start = (page - 1) * limit`, затем `array.slice(start, start + limit)`.

```javascript
// Запрос: GET /api/users?page=2&limit=2
const url = new URL(req.url, 'http://localhost');

const page = parseInt(url.searchParams.get('page')) || 1;   // если нет — по умолчанию 1
const limit = parseInt(url.searchParams.get('limit')) || 10; // если нет — по умолчанию 10

const start = (page - 1) * limit;  // (2 - 1) * 2 = 2
const result = users.slice(start, start + limit);  // slice(2, 4) → [Peter, Anna]
```

---

## ✏️ Задание

### Описание

Напишите функции для парсинга URL и создайте сервер с динамическими маршрутами.

1. `parseUrl(url)` — парсит URL на pathname и query
2. `extractId(pathname, prefix)` — извлекает ID из пути
3. `createServer()` — сервер с API для работы с пользователями

### Требования

1. `parseUrl(url)`:
   - Принимает строку URL (например, `/api/users?page=1`)
   - Возвращает `{ pathname, query }`
   - `query` — объект с параметрами

2. `extractId(pathname, prefix)`:
   - Извлекает числовой ID после префикса
   - `extractId('/users/123', '/users/')` → `123`
   - Если ID нет или он не число — возвращает `null`

3. `createServer()` — сервер с эндпоинтами:
   - `GET /api/users` — список пользователей (с пагинацией через `?page=&limit=`)
   - `GET /api/users/:id` — пользователь по ID
   - `404` для остальных

Данные для сервера:
```javascript
const users = [
  { id: 1, name: 'Ivan' },
  { id: 2, name: 'Maria' },
  { id: 3, name: 'Peter' },
  { id: 4, name: 'Anna' },
  { id: 5, name: 'Alex' }
];
```

### Примеры

```javascript
parseUrl('/api/users?page=2&limit=10');
// { pathname: '/api/users', query: { page: '2', limit: '10' } }

parseUrl('/api/users/5');
// { pathname: '/api/users/5', query: {} }

extractId('/users/123', '/users/');  // 123
extractId('/users/abc', '/users/');  // null
extractId('/posts/5', '/users/');    // null

// Сервер:
// GET /api/users → [все пользователи]
// GET /api/users?page=1&limit=2 → [{ id: 1, ... }, { id: 2, ... }]
// GET /api/users/3 → { id: 3, name: 'Peter' }
// GET /api/users/999 → 404 { error: 'User not found' }
```

---

## 💭 Подсказки

<details>
<summary>Подсказка 1: Направление</summary>

Для парсинга URL подумайте, какой встроенный класс в JavaScript разбирает строку URL на составные части (pathname, search params). Для извлечения ID — как проверить, что строка начинается с определённого префикса, и как получить остаток после него?
</details>

<details>
<summary>Подсказка 2: Структура</summary>

Для парсинга URL используйте встроенный класс `new URL()` (с фиктивным базовым адресом для относительных путей). Он даёт доступ к `pathname` и `searchParams`, из которых можно собрать нужный объект. Для извлечения ID проверьте, начинается ли путь с нужного префикса, и возьмите остаток строки после него.

</details>

<details>
<summary>Подсказка 3: Подход</summary>

Для `parseUrl` — создайте `new URL(urlString, 'http://localhost')`, возьмите `pathname` и преобразуйте `searchParams` в объект через `Object.fromEntries()`. Для `extractId` — проверьте, что `pathname` начинается с `prefix` (через `startsWith`), вырежьте остаток строки после префикса (через `slice` с длиной префикса), преобразуйте в число через `parseInt` и верните `null` если результат `NaN`, иначе само число. В `createServer` используйте `parseUrl` для разбора `req.url`, затем: если путь точно равен `/api/users` — верните список пользователей с пагинацией (получите `page` и `limit` из query, вычислите смещение и используйте `slice` на массиве). Если путь начинается с `/api/users/` — извлеките ID через `extractId`, найдите пользователя в массиве и верните его, либо 404 если не найден. Для всех остальных путей — 404.

</details>

---

## 🧪 Как проверить решение

```bash
npx vitest module-24/index.spec.js
```

---

## 📖 Дополнительные материалы

- [MDN: URL](https://developer.mozilla.org/ru/docs/Web/API/URL)

---

## 🎓 Что дальше?

Переходите к **Модуль 25: POST-запросы** — научитесь принимать данные от клиента.
