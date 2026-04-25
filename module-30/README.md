# Модуль 30: Введение в React

## 🎯 Цель модуля

Научиться создавать компоненты на React: JSX, props, useState.

---

## 📚 Теория

### Что такое React?

**React** — библиотека для создания пользовательских интерфейсов из **компонентов**.

```
Обычный HTML:          React:
┌──────────┐          ┌──────────┐
│ <div>    │          │ <App>    │
│   <h1>   │          │   <Header />
│   <ul>   │          │   <TodoList />
│     <li> │          │     <TodoItem />
│     <li> │          │     <TodoItem />
│   </ul>  │          │   </TodoList>
│ </div>   │          │ </App>   │
└──────────┘          └──────────┘
```

### JSX

JSX — HTML внутри JavaScript:

```jsx
// Это JSX — не строка, не HTML
const element = <h1>Привет, мир!</h1>;

// JSX с выражениями
const name = 'Ivan';
const greeting = <h1>Привет, {name}!</h1>;

// JSX с условиями
const message = <p>{isLoggedIn ? 'Выйти' : 'Войти'}</p>;
```

### Компоненты

Компонент — функция, которая возвращает JSX:

```jsx
function Welcome() {
  return <h1>Привет!</h1>;
}

// Использование
<Welcome />
```

### Props (свойства)

Данные, которые передаются компоненту:

```jsx
function Greeting({ name, age }) {
  return (
    <div>
      <h1>Привет, {name}!</h1>
      <p>Возраст: {age}</p>
    </div>
  );
}

// Использование
<Greeting name="Ivan" age={25} />
```

### useState (состояние)

Данные, которые могут **меняться** внутри компонента:

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  //      ↑        ↑              ↑
  //   значение  setter    начальное значение

  return (
    <div>
      <p>Счёт: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
    </div>
  );
}
```

### Списки и key

```jsx
function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Атрибут `data-testid`

В тестах нужно находить элементы на странице. Вместо привязки к CSS-классам или тексту (которые могут меняться) используют специальный атрибут `data-testid`:

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <span data-testid="count">{count}</span>
      <button data-testid="increment" onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}

// В тестах:
screen.getByTestId('count')      // находит <span>
screen.getByTestId('increment')  // находит <button>
```

`data-testid` — стандартный способ пометить элементы для тестов. Он не влияет на работу приложения, но делает тесты устойчивыми к изменениям в дизайне.

---

## 💡 Примеры

### Пример: Список с удалением

```jsx
function ItemList() {
  const [items, setItems] = useState(['Apple', 'Banana', 'Cherry']);

  function removeItem(index) {
    setItems(items.filter((_, i) => i !== index));
  }

  return (
    <ul>
      {items.map((item, i) => (
        <li key={i}>
          {item}
          <button onClick={() => removeItem(i)}>×</button>
        </li>
      ))}
    </ul>
  );
}
```

---

## ✏️ Задание

### Описание

Создайте три React-компонента:

1. `Greeting` — приветствие по имени
2. `Counter` — счётчик с кнопками
3. `TodoList` — список задач

### Требования

1. `Greeting({ name })`:
   - Принимает prop `name`
   - Рендерит `<h1>Привет, {name}!</h1>`
   - Если `name` пустой — `<h1>Привет, мир!</h1>`

2. `Counter({ initial })`:
   - Принимает prop `initial` (начальное значение, по умолчанию 0)
   - Показывает текущее значение в `<span>` с `data-testid="count"`
   - Кнопка `+` (data-testid="increment") — увеличивает на 1
   - Кнопка `-` (data-testid="decrement") — уменьшает на 1
   - Кнопка `Reset` (data-testid="reset") — сбрасывает к initial

3. `TodoList({ items })`:
   - Принимает prop `items` — массив строк
   - Рендерит `<ul>` с `<li>` для каждого элемента
   - Пустой массив → `<p>Нет задач</p>`

### Примеры

```jsx
<Greeting name="Ivan" />
// → <h1>Привет, Ivan!</h1>

<Greeting name="" />
// → <h1>Привет, мир!</h1>

<Counter initial={10} />
// → Показывает 10, кнопки +, -, Reset

<TodoList items={['Buy milk', 'Walk dog']} />
// → <ul><li>Buy milk</li><li>Walk dog</li></ul>

<TodoList items={[]} />
// → <p>Нет задач</p>
```

---

## 💭 Подсказки

<details>
<summary>Подсказка 1: Направление</summary>

Каждый компонент — это функция, возвращающая JSX. Для `Greeting` подумайте, как обработать пустое имя (оператор `||`). Для `Counter` вам понадобится хук `useState`. Для `TodoList` — условный рендеринг в зависимости от длины массива.
</details>

<details>
<summary>Подсказка 2: Структура</summary>

`Greeting` — простейший компонент: верните `<h1>` с интерполяцией имени. Для обработки пустого имени используйте оператор `||`.

`Counter` — используйте `useState` с начальным значением из prop `initial`. Компонент возвращает `<span>` для отображения значения и три кнопки. Каждой кнопке нужен `onClick` с вызовом setter-функции и атрибут `data-testid`.

`TodoList` — проверьте длину массива: если пуст — верните `<p>`, иначе — `<ul>` с маппингом элементов в `<li>`. Не забудьте prop `key`.

</details>

<details>
<summary>Подсказка 3: Подход</summary>

`Greeting`: принимает `name`, возвращает `<h1>Привет, {выражение}!</h1>`, где выражение — это `name || 'мир'`, чтобы при пустом имени подставлялось значение по умолчанию.

`Counter`: деструктурируйте prop `initial` со значением по умолчанию 0. Создайте состояние через `useState(initial)`. Верните div со span (data-testid="count"), отображающим текущее значение, и тремя кнопками: increment (увеличивает на 1), decrement (уменьшает на 1), reset (устанавливает обратно `initial`). Каждая кнопка имеет свой data-testid и onClick-обработчик, вызывающий setCount с нужным значением.

`TodoList`: если `items.length === 0` — верните `<p>Нет задач</p>`. Иначе верните `<ul>`, внутри которого `items.map` создаёт `<li>` для каждого элемента. В качестве `key` можно использовать индекс.

</details>

---

## 🧪 Как проверить решение

```bash
npx vitest module-30/index.spec.jsx
```

---

## 📖 Дополнительные материалы

- [React: Быстрый старт](https://react.dev/learn)

---

## 🎓 Что дальше?

Переходите к **Модуль 31: React + Fetch** — подключим React к серверному API.
