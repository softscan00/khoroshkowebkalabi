/**
 * Модуль 17: HTML основы
 *
 * Задание: Напишите функцию createHTML, которая генерирует
 * HTML-разметку карточки пользователя.
 */

/**
 * createHTML — создаёт HTML-разметку карточки пользователя
 *
 * @param {Object} user - объект пользователя
 * @param {string} user.name - имя пользователя
 * @param {string} user.email - email пользователя
 * @param {string} user.avatar - URL аватара
 * @returns {string} - HTML-разметка карточки
 */
function createHTML(user) {
  return `
  <div class="user-card">
  <img src="${user.avatar}" alt="${user.name}">
  <h2>${user.name}</h2>
  <p>${user.email}</p>
  </div>`
}

// Экспорт для Node.js (тесты) и браузера
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createHTML };
}
if (typeof window !== 'undefined') {
  window.createHTML = createHTML;
}
