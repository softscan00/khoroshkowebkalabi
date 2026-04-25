# Модуль 28: Работа с файлами (fs)

## 🎯 Цель модуля

Научиться читать и записывать файлы в Node.js для хранения данных между перезапусками.

---

## 📚 Теория

### Зачем файлы?

В модуле 27 данные хранились в памяти — при перезапуске сервера всё пропадало. Файлы решают эту проблему.

```
Память (RAM)           Файл (диск)
┌──────────┐          ┌──────────┐
│ todos=[] │   save   │ data.json│
│          │ ───────→ │ [{...}]  │
│          │ ←─────── │          │
│          │   load   │          │
└──────────┘          └──────────┘
 Пропадает            Остаётся
```

### Модуль fs в Node.js

```javascript
const fs = require('fs');
```

### Чтение файла

```javascript
const data = fs.readFileSync('data.json', 'utf-8');  // строка
const parsed = JSON.parse(data);                      // объект/массив
```

### Запись файла

```javascript
const json = JSON.stringify(todos, null, 2);  // null — без фильтрации, 2 — отступ для читаемости
fs.writeFileSync('data.json', json);
```

### Проверка существования файла

```javascript
if (fs.existsSync('data.json')) {
  // Файл есть — читаем
  const data = fs.readFileSync('data.json', 'utf-8');
} else {
  // Файла нет — создаём с начальными данными
  fs.writeFileSync('data.json', '[]');
}
```

### JSON как база данных

Простейший способ хранить данные — JSON-файл:

```javascript
// Загрузить данные
function loadData(filepath) {
  if (!fs.existsSync(filepath)) {
    return [];
  }
  const raw = fs.readFileSync(filepath, 'utf-8');
  return JSON.parse(raw);
}

// Сохранить данные
function saveData(filepath, data) {
  const json = JSON.stringify(data, null, 2);
  fs.writeFileSync(filepath, json);
}
```

### Работа с путями (path)

```javascript
const path = require('path');

// Собрать путь
const filepath = path.join(__dirname, 'data.json');
// → '/Users/user/project/data.json'

// __dirname — папка текущего файла
```

---

## 💡 Примеры

### Пример 1: Простое чтение/запись

```javascript
const fs = require('fs');

// Записать
const users = [{ name: 'Ivan' }, { name: 'Maria' }];
fs.writeFileSync('users.json', JSON.stringify(users, null, 2));

// Прочитать
const data = fs.readFileSync('users.json', 'utf-8');
const loaded = JSON.parse(data);
console.log(loaded); // [{ name: 'Ivan' }, { name: 'Maria' }]
```

---

## ✏️ Задание

### Описание

Создайте модуль для хранения данных в JSON-файле:

1. `createStore(filepath)` — создаёт хранилище
2. Хранилище предоставляет методы для CRUD-операций

### Требования

`createStore(filepath)` возвращает объект с методами:

1. `getAll()` — возвращает все записи (массив)
2. `getById(id)` — возвращает запись по id или `null`
3. `add(item)` — добавляет запись:
   - Автоматически присваивает `id` (инкремент)
   - Сохраняет файл
   - Возвращает добавленную запись с id
4. `update(id, changes)` — обновляет запись:
   - Находит по id
   - Мержит `changes` через `Object.assign`
   - Сохраняет файл
   - Возвращает обновлённую запись или `null`
5. `remove(id)` — удаляет запись:
   - Сохраняет файл
   - Возвращает `true` если удалена, `false` если не найдена

**Данные сохраняются в файл после каждого изменения.**
**При создании store — если файл существует, загружает данные из него.**

### Примеры

```javascript
const store = createStore('/tmp/todos.json');

// Добавить
const todo1 = store.add({ title: 'Купить молоко' });
// { id: 1, title: 'Купить молоко' }

const todo2 = store.add({ title: 'Выгулять собаку' });
// { id: 2, title: 'Выгулять собаку' }

// Получить все
store.getAll();
// [{ id: 1, ... }, { id: 2, ... }]

// Получить по id
store.getById(1);
// { id: 1, title: 'Купить молоко' }

store.getById(999);
// null

// Обновить
store.update(1, { completed: true });
// { id: 1, title: 'Купить молоко', completed: true }

// Удалить
store.remove(2);  // true
store.remove(99); // false

// Данные сохранены в файл!
// При повторном createStore('/tmp/todos.json') — данные загрузятся
```

---

## 💭 Подсказки

<details>
<summary>Подсказка 1: Направление</summary>

Подумайте, какие данные нужно хранить внутри `createStore`: сам массив записей и счётчик для следующего id. Как при инициализации определить, с какого id продолжать нумерацию, если файл уже содержит данные?
</details>

<details>
<summary>Подсказка 2: Структура</summary>

Функция `createStore` использует замыкание: внутри хранятся массив данных и счётчик `nextId`. При инициализации проверьте, существует ли файл (`fs.existsSync`). Если да — загрузите и распарсите его, а `nextId` вычислите как максимальный id из загруженных данных + 1 (используйте `Math.max`). Вспомогательная функция `save` сериализует массив и записывает в файл. Верните объект с пятью методами, каждый из которых работает с внутренним массивом.

</details>

<details>
<summary>Подсказка 3: Подход</summary>

`getAll` — просто возвращает внутренний массив. `getById` — ищет элемент через `find` по id, возвращает его или `null`. `add` — создаёт новый объект, объединяя `{ id: nextId++ }` со входящим `item` (через spread), добавляет в массив, вызывает `save`, возвращает созданный объект. `update` — находит элемент через `find`, если не найден — `null`, иначе применяет `changes` через `Object.assign`, вызывает `save`, возвращает обновлённый элемент. `remove` — находит индекс через `findIndex`, если не найден — `false`, иначе удаляет через `splice`, вызывает `save`, возвращает `true`.

При вычислении `nextId` из загруженных данных учтите случай пустого массива — `Math.max` от пустого списка вернёт `-Infinity`, поэтому нужно предусмотреть значение по умолчанию (например, 0) и прибавить 1.

</details>

---

## 🧪 Как проверить решение

```bash
npx vitest module-28/index.spec.js
```

---

## 📖 Дополнительные материалы

- [Node.js: fs](https://nodejs.org/docs/latest/api/fs.html)

---

## 🎓 Что дальше?

Переходите к **Модуль 29: Express** — перепишем сервер с удобным фреймворком.
