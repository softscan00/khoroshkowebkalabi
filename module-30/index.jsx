/**
 * Модуль 30: Введение в React
 *
 * Задание: Создайте три компонента: Greeting, Counter, TodoList.
 */

import { useState } from 'react';

/**
 * Greeting — компонент приветствия
 *
 * @param {Object} props
 * @param {string} props.name - имя (если пустое — "мир")
 * @returns {JSX.Element} - <h1>Привет, {name}!</h1>
 */
export function Greeting({ name }) {
  // Если name пустой/не передан — показываем "мир"
  const displayName = name && name.trim() ? name : 'мир';
  
  return <h1>Привет, {displayName}!</h1>;
}

/**
 * Counter — компонент счётчика
 *
 * @param {Object} props
 * @param {number} props.initial - начальное значение (по умолчанию 0)
 * @returns {JSX.Element}
 */
export function Counter({ initial = 0 }) {
  // Состояние для текущего значения
  const [count, setCount] = useState(initial);

  return (
    <div>
      {/* Отображение текущего значения */}
      <span data-testid="count">{count}</span>
      
      {/* Кнопка +1 */}
      <button 
        data-testid="increment" 
        onClick={() => setCount(count + 1)}
      >
        +
      </button>
      
      {/* Кнопка -1 */}
      <button 
        data-testid="decrement" 
        onClick={() => setCount(count - 1)}
      >
        -
      </button>
      
      {/* Кнопка сброса к initial */}
      <button 
        data-testid="reset" 
        onClick={() => setCount(initial)}
      >
        Reset
      </button>
    </div>
  );
}

/**
 * TodoList — компонент списка задач
 *
 * @param {Object} props
 * @param {string[]} props.items - массив строк-задач
 * @returns {JSX.Element}
 */
export function TodoList({ items }) {
  // Если массив пустой — показываем сообщение
  if (!items || items.length === 0) {
    return <p>Нет задач</p>;
  }

  // Иначе рендерим список
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}