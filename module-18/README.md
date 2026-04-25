# Модуль 18: DOM (Document Object Model)

## 🎯 Цель модуля

Научиться находить и изменять элементы на веб-странице с помощью JavaScript.

---

## 📚 Теория

### Что такое DOM?

**DOM** (Document Object Model) — это представление HTML-документа в виде дерева объектов. JavaScript может читать и изменять это дерево, тем самым меняя страницу.

```
document
└── html
    ├── head
    │   └── title
    └── body
        ├── h1
        ├── p
        └── div
            └── button
```

### Поиск элементов — querySelector

```javascript
// По тегу
const header = document.querySelector('h1');

// По классу
const card = document.querySelector('.card');

// По id
const menu = document.querySelector('#menu');
```

`querySelector` принимает CSS-селектор и возвращает первый найденный элемент. Если элемент не найден — возвращает `null`.

### Изменение текста — textContent

```javascript
const title = document.querySelector('h1');

// Прочитать текст
console.log(title.textContent);  // 'Старый заголовок'

// Изменить текст
title.textContent = 'Новый заголовок';
```

### Работа с классами — classList

```javascript
const box = document.querySelector('.box');

box.classList.add('active');       // добавить класс
box.classList.remove('active');    // убрать класс
box.classList.toggle('active');    // переключить (есть → убрать, нет → добавить)
box.classList.contains('active');  // проверить — true/false
```

`classList.toggle()` возвращает `true` если класс был добавлен, `false` если убран.

---

## 💡 Примеры

### Пример 1: Найти элемент и прочитать текст

```javascript
// HTML: <h1 id="title">Старый заголовок</h1>
const title = document.querySelector('#title');
console.log(title.textContent);  // 'Старый заголовок'
title.textContent = 'Новый заголовок';
```

### Пример 2: Переключение класса

```javascript
// HTML: <div class="menu"></div>
const menu = document.querySelector('.menu');
const wasAdded = menu.classList.toggle('open');
console.log(wasAdded);  // true (класс добавлен)
// Результат: <div class="menu open"></div>
```

---

## ✏️ Задание

### Описание

Напишите три функции для работы с DOM:

1. `getElementText(selector)` — возвращает текстовое содержимое элемента
2. `setElementText(selector, text)` — устанавливает текст элемента
3. `toggleClass(selector, className)` — переключает класс у элемента

### Требования

1. `getElementText(selector)`:
   - Находит элемент по селектору
   - Возвращает его `textContent`
   - Если элемент не найден — возвращает `null`

2. `setElementText(selector, text)`:
   - Находит элемент по селектору
   - Устанавливает `textContent`
   - Возвращает `true` если успешно, `false` если элемент не найден

3. `toggleClass(selector, className)`:
   - Находит элемент по селектору
   - Переключает указанный класс (add/remove)
   - Возвращает `true` если класс добавлен, `false` если удалён, `null` если элемент не найден

### Примеры использования

```javascript
// HTML: <h1 id="title">Привет</h1>
getElementText('#title');  // 'Привет'

setElementText('#title', 'Пока');  // true
// HTML: <h1 id="title">Пока</h1>

// HTML: <div class="box"></div>
toggleClass('.box', 'active');  // true (класс добавлен)
// HTML: <div class="box active"></div>

toggleClass('.box', 'active');  // false (класс удалён)
// HTML: <div class="box"></div>
```

---

## 💭 Подсказки

<details>
<summary>Подсказка 1: Направление</summary>
Все три функции начинаются одинаково: найти элемент и проверить, существует ли он. Что должна вернуть функция, если элемент не найден? Подумайте, какой метод DOM ищет элемент по CSS-селектору.
</details>

<details>
<summary>Подсказка 2: Структура</summary>

Каждая функция начинается одинаково: найти элемент через `document.querySelector`, проверить, не `null` ли результат, и если элемент не найден — вернуть специальное значение. Для работы с классами вспомните, что у каждого DOM-элемента есть свойство `classList` с удобными методами.

</details>

<details>
<summary>Подсказка 3: Подход</summary>

Для `getElementText` — найдите элемент, верните `null` если не найден, иначе верните его `textContent`. Для `setElementText` — аналогично найдите элемент, если не найден верните `false`, иначе установите `textContent` и верните `true`. Для `toggleClass` — найдите элемент, если не найден верните `null`, иначе вызовите `classList.toggle()` с именем класса. Обратите внимание, что `classList.toggle()` сам возвращает булево значение, которое можно использовать напрямую как результат функции.

</details>

---

## 🧪 Как проверить решение

```bash
npx vitest module-18/index.spec.js
```

Также откройте `index.html` в браузере и используйте кнопки для тестирования.

---

## 📖 Дополнительные материалы

- [JavaScript.info: DOM](https://learn.javascript.ru/document)

---

## 🎓 Что дальше?

После выполнения переходите к **Модуль 19: События** — научитесь реагировать на действия пользователя.
