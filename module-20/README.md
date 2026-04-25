# Модуль 20: Формы и валидация

## 🎯 Цель модуля

Научиться собирать данные из форм и проверять их корректность перед отправкой.

---

## 📚 Теория

### Получение данных из формы через FormData

`FormData` — встроенный класс, который собирает все данные из формы. С помощью `Object.fromEntries` можно превратить его в обычный объект:

```javascript
const form = document.querySelector('#myForm');

const formData = new FormData(form);
const data = Object.fromEntries(formData);
// { username: 'ivan', email: 'ivan@mail.ru', password: '12345678' }
```

Каждое поле формы должно иметь атрибут `name` — именно по нему FormData собирает значения:

```html
<input type="text" name="username">
<input type="email" name="email">
<input type="password" name="password">
```

### JavaScript-валидация

Валидация — проверка данных перед отправкой. Обычно создают объект ошибок и проверяют каждое поле:

```javascript
function validateForm(data) {
  const errors = {};

  if (!data.username || data.username.length < 3) {
    errors.username = 'Минимум 3 символа';
  }

  if (!data.email.includes('@')) {
    errors.email = 'Некорректный email';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
```

`Object.keys(errors).length === 0` — если ошибок нет, объект пустой, значит форма валидна.

---

## 💡 Примеры

### Пример: Сбор данных и валидация

```javascript
const form = document.querySelector('#register');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form));
  // { username: 'iv', email: 'test', password: '123' }

  const result = validateForm(data);
  // { isValid: false, errors: { username: 'Минимум 3 символа', ... } }
});
```

---

## ✏️ Задание

### Описание

Напишите две функции для работы с формами:

1. `getFormData(selector)` — собирает данные из формы в объект
2. `validateForm(data)` — валидирует данные формы

### Требования

1. `getFormData(selector)`:
   - Находит форму по селектору
   - Возвращает объект с данными формы (используя FormData)
   - Если форма не найдена — возвращает `null`

2. `validateForm(data)`:
   - Принимает объект с полями: `username`, `email`, `password`
   - Проверяет:
     - `username`: минимум 3 символа → ошибка: `"Минимум 3 символа"`
     - `email`: содержит `@` и `.` → ошибка: `"Некорректный email"`
     - `password`: минимум 8 символов → ошибка: `"Минимум 8 символов"`
   - Возвращает объект `{ isValid: boolean, errors: object }`
   - `errors` содержит сообщения для невалидных полей (тексты должны совпадать точно)

### Примеры использования

```javascript
// Форма с полями name="username", name="email"
const data = getFormData('#register');
// { username: 'ivan', email: 'ivan@mail.ru', password: '12345678' }

const result = validateForm({
  username: 'iv',
  email: 'invalid',
  password: '123'
});
// {
//   isValid: false,
//   errors: {
//     username: 'Минимум 3 символа',
//     email: 'Некорректный email',
//     password: 'Минимум 8 символов'
//   }
// }

const result2 = validateForm({
  username: 'ivan',
  email: 'ivan@mail.ru',
  password: '12345678'
});
// { isValid: true, errors: {} }
```

---

## 💭 Подсказки

<details>
<summary>Подсказка 1: Направление</summary>
Для сбора данных формы существует встроенный класс `FormData`. Как превратить его в обычный объект? А для валидации подумайте: какие два символа обязательно должны быть в email?
</details>

<details>
<summary>Подсказка 2: Структура</summary>

Для сбора данных формы используйте конструктор `FormData`, передав ему найденный элемент формы. Чтобы превратить `FormData` в обычный объект, есть удобный статический метод `Object.fromEntries()`. Для валидации создайте пустой объект ошибок и последовательно проверяйте каждое поле.

</details>

<details>
<summary>Подсказка 3: Подход</summary>

Для `getFormData` — найдите форму по селектору, верните `null` если не найдена, иначе создайте `new FormData(form)` и сконвертируйте в обычный объект через `Object.fromEntries()`. Для `validateForm` — создайте пустой объект `errors`, затем проверьте каждое поле: `username` должен существовать и иметь длину не менее 3 символов, `email` должен содержать символы `@` и `.`, `password` должен иметь длину не менее 8 символов. Для каждой неудачной проверки добавляйте в `errors` запись с сообщением. В конце определите `isValid` — проверьте, пуст ли объект ошибок (через `Object.keys(errors).length`). Тексты ошибок должны точно совпадать с тем, что ожидают тесты.

</details>

---

## 🧪 Как проверить решение

```bash
npx vitest module-20/index.spec.js
```

Также откройте `index.html` для интерактивного тестирования.

---

## 📖 Дополнительные материалы

- [MDN: FormData](https://developer.mozilla.org/ru/docs/Web/API/FormData)

---

## 🎓 Что дальше?

Блок 5 (HTML и DOM) завершён! Переходите к **Модуль 21: HTTP** — узнаете как браузер общается с сервером.
