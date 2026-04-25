/**
 * Модуль 18: DOM (Document Object Model)
 *
 * Задание: Напишите три функции для работы с DOM.
 */

/**
 * getElementText — возвращает текстовое содержимое элемента
 *
 * @param {string} selector - CSS-селектор
 * @returns {string|null} - текст элемента или null если не найден
 */
function getElementText(selector) {
  try {
    const text = document.querySelector(selector)
    return text.textContent
  }
  catch {
    return null
  }
}


/**
 * setElementText — устанавливает текст элемента
 *
 * @param {string} selector - CSS-селектор
 * @param {string} text - новый текст
 * @returns {boolean} - true если успешно, false если элемент не найден
 */
function setElementText(selector, text) {
  const t = document.querySelector(selector)
  try {
    t.textContent=text
    return true
  }
  catch {
    return false
  }
}

/**
 * toggleClass — переключает класс у элемента
 *
 * @param {string} selector - CSS-селектор
 * @param {string} className - имя класса
 * @returns {boolean|null} - true если добавлен, false если удалён, null если элемент не найден
 */
function toggleClass(selector, className) {
  try {
  const t = document.querySelector(selector)
  t.classList.toggle(className)
  return t.classList.contains(className)
  }
  catch {
    return null
  }
}

// Экспорт для Node.js (тесты) и браузера
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getElementText, setElementText, toggleClass };
}
if (typeof window !== 'undefined') {
  window.getElementText = getElementText;
  window.setElementText = setElementText;
  window.toggleClass = toggleClass;
}
