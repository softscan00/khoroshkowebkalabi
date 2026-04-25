/**
 * Модуль 27: TODO-приложение — Frontend
 *
 * Задание: Напишите функции для работы с API и DOM.
 */

/**
 * fetchTodos — загружает список задач
 *
 * @param {string} baseUrl - базовый URL сервера
 * @returns {Promise<Array>} - массив задач
 */
async function fetchTodos(baseUrl) {
  const response = await fetch(`${baseUrl}/api/todos`);
  return await response.json();
}

/**
 * addTodo — создаёт новую задачу
 *
 * @param {string} baseUrl - базовый URL сервера
 * @param {string} title - текст задачи
 * @returns {Promise<Object>} - созданная задача
 */
async function addTodo(baseUrl, title) {
  const response = await fetch(`${baseUrl}/api/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  return await response.json();
}

/**
 * toggleTodo — переключает completed у задачи
 *
 * @param {string} baseUrl - базовый URL сервера
 * @param {number} id - ID задачи
 * @returns {Promise<Object>} - обновлённая задача
 */
async function toggleTodo(baseUrl, id) {
  const response = await fetch(`${baseUrl}/api/todos/${id}`, {
    method: 'PATCH'
  });
  return await response.json();
}

/**
 * deleteTodo — удаляет задачу
 *
 * @param {string} baseUrl - базовый URL сервера
 * @param {number} id - ID задачи
 * @returns {Promise<boolean>} - true
 */
async function deleteTodo(baseUrl, id) {
  const response = await fetch(`${baseUrl}/api/todos/${id}`, {
    method: 'DELETE'
  });
  return true;
}

/**
 * renderTodos — отрисовывает задачи в DOM
 *
 * Каждая задача:
 * <li class="completed?">
 *   <span class="todo-title">текст</span>
 *   <button class="delete-btn">×</button>
 * </li>
 *
 * @param {Array} todos - массив задач
 * @param {HTMLElement} container - контейнер (ul/ol)
 */
function renderTodos(todos, container) {
  container.innerHTML = '';
  
  todos.forEach(todo => {
    const li = document.createElement('li');
    
    if (todo.completed) {
      li.classList.add('completed');
    }
    
    const titleSpan = document.createElement('span');
    titleSpan.className = 'todo-title';
    titleSpan.textContent = todo.title;
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '×';
    
    li.appendChild(titleSpan);
    li.appendChild(deleteBtn);
    
    container.appendChild(li);
  });
}

// Экспорт для Node.js (тесты)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { fetchTodos, addTodo, toggleTodo, deleteTodo, renderTodos };
}
