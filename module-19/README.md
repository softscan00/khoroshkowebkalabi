# Модуль 19: События (Events)

## 🎯 Цель модуля

Научиться реагировать на действия пользователя: клики, ввод текста, отправка форм и другие события.

---

## 📚 Теория

### Что такое событие?

**Событие** — это сигнал о том, что что-то произошло: пользователь кликнул, ввёл текст, отправил форму.

### addEventListener — добавление обработчика

```javascript
const button = document.querySelector('button');

button.addEventListener('click', () => {
  console.log('Кнопка нажата!');
});
```

Синтаксис: `элемент.addEventListener(типСобытия, функцияОбработчик)`

### Три события, нужные для задания

| Событие | Когда срабатывает |
|---------|-------------------|
| `click` | Клик мышью |
| `input` | Каждое изменение значения в поле ввода |
| `submit` | Отправка формы |

### Объект события (event)

Обработчик получает объект `event` с информацией о событии:

```javascript
button.addEventListener('click', (event) => {
  console.log(event.target);  // элемент, на котором произошёл клик
});

input.addEventListener('input', (event) => {
  console.log(event.target.value);  // текущее значение поля
});
```

### Удаление обработчика

Если элемент удаляется со страницы или обработчик больше не нужен — его стоит снять. Иначе он продолжит висеть в памяти и реагировать на события, что может приводить к багам и утечкам памяти.

Чтобы удалить обработчик, нужно передать **ту же самую функцию**:

```javascript
function handleClick() {
  console.log('Клик!');
}

button.addEventListener('click', handleClick);    // добавить
button.removeEventListener('click', handleClick); // удалить
```

Анонимную стрелочную функцию удалить нельзя — ссылка на неё потеряна. Поэтому если планируете удалять обработчик — выносите функцию в переменную.

### preventDefault — отмена действия по умолчанию

При отправке формы браузер по умолчанию перезагружает страницу. Чтобы этого не происходило:

```javascript
form.addEventListener('submit', (event) => {
  event.preventDefault();  // страница НЕ перезагрузится
  console.log('Форма обработана через JS');
});
```

---

## 💡 Примеры

### Пример 1: Счётчик кликов

```javascript
let count = 0;
const button = document.querySelector('#counter');
const display = document.querySelector('#count');

button.addEventListener('click', () => {
  count++;
  display.textContent = count;
});
```

### Пример 2: Реакция на ввод текста

```javascript
const input = document.querySelector('#search');

input.addEventListener('input', (e) => {
  console.log('Введено:', e.target.value);
});
```

---

## ✏️ Задание

### Описание

Напишите три функции для работы с событиями:

1. `onClick(selector, callback)` — добавляет обработчик клика
2. `onInput(selector, callback)` — добавляет обработчик ввода
3. `onSubmit(selector, callback)` — добавляет обработчик отправки формы с preventDefault

### Требования

1. `onClick(selector, callback)`:
   - Находит элемент по селектору
   - Добавляет обработчик события `click`
   - callback получает объект события (event)
   - Возвращает `true` если успешно, `false` если элемент не найден

2. `onInput(selector, callback)`:
   - Находит элемент по селектору
   - Добавляет обработчик события `input`
   - callback получает текущее значение поля (event.target.value)
   - Возвращает `true` если успешно, `false` если элемент не найден

3. `onSubmit(selector, callback)`:
   - Находит форму по селектору
   - Добавляет обработчик события `submit`
   - **Автоматически вызывает `event.preventDefault()`**
   - callback получает объект события
   - Возвращает `true` если успешно, `false` если форма не найдена

### Примеры использования

```javascript
onClick('#btn', (event) => {
  console.log('Клик!', event.target);
});

onInput('#search', (value) => {
  console.log('Введено:', value);
});

onSubmit('#form', (event) => {
  console.log('Форма отправлена');
  // Страница НЕ перезагружается благодаря preventDefault
});
```

---

## 💭 Подсказки

<details>
<summary>Подсказка 1: Направление</summary>
Все три функции работают по одной схеме: найти элемент, проверить его существование, добавить обработчик нужного типа. Чем отличается `onInput` от остальных? Подумайте, что именно получает callback в каждом случае.
</details>

<details>
<summary>Подсказка 2: Структура</summary>

Каждая функция ищет элемент, проверяет его наличие и навешивает обработчик нужного типа события. Ключевое отличие между функциями — в том, что именно передаётся в `callback`: в одном случае это объект события целиком, в другом — конкретное значение из поля ввода (`event.target.value`).

</details>

<details>
<summary>Подсказка 3: Подход</summary>

Для `onClick` — найдите элемент, если не найден верните `false`, иначе добавьте обработчик события `click`, передающий объект `event` в callback, и верните `true`. Для `onInput` — то же самое, но событие `input`, и в callback нужно передавать не весь event, а `event.target.value`. Для `onSubmit` — найдите форму, добавьте обработчик `submit`, внутри которого сначала вызовите `event.preventDefault()` для отмены перезагрузки страницы, а потом передайте объект события в callback.

</details>

---

## 🧪 Как проверить решение

```bash
npx vitest module-19/index.spec.js
```

Также откройте `index.html` и протестируйте интерактивно.

---

## 📖 Дополнительные материалы

- [JavaScript.info: Введение в события](https://learn.javascript.ru/events)

---

## 🎓 Что дальше?

После выполнения переходите к **Модуль 20: Формы и валидация** — научитесь собирать и проверять данные из форм.
