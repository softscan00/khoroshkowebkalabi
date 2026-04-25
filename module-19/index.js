/**
 * Модуль 19: События (Events)
 *
 * Задание: Напишите три функции для работы с событиями.
 */

/**
 * onClick — добавляет обработчик клика
 *
 * @param {string} selector - CSS-селектор
 * @param {Function} callback - функция-обработчик, получает event
 * @returns {boolean} - true если успешно, false если элемент не найден
 */
function onClick(selector, callback) {
  a=document.querySelector(selector)
  try {
    a.addEventListener('click', function(event) {
      callback(event)
    })
    return true
  }
  catch {
    return false
  }
}

/**
 * onInput — добавляет обработчик ввода
 *
 * @param {string} selector - CSS-селектор
 * @param {Function} callback - функция-обработчик, получает value (строку)
 * @returns {boolean} - true если успешно, false если элемент не найден
 */
function onInput(selector, callback) {
  a=document.querySelector(selector)
  try {
    a.addEventListener('input', function(event) {
      callback(event.target.value)
    })
    return true
  }
  catch {
    return false
  }
}

/**
 * onSubmit — добавляет обработчик отправки формы
 *
 * @param {string} selector - CSS-селектор формы
 * @param {Function} callback - функция-обработчик, получает event
 * @returns {boolean} - true если успешно, false если форма не найдена
 */
function onSubmit(selector, callback) {
  a=document.querySelector(selector)
  try {
    a.addEventListener('submit', function(event) {
      event.preventDefault()
      callback(event)
    })
    return true
  }
  catch {
    return false
  }
}

// Экспорт для Node.js (тесты) и браузера
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { onClick, onInput, onSubmit };
}
if (typeof window !== 'undefined') {
  window.onClick = onClick;
  window.onInput = onInput;
  window.onSubmit = onSubmit;
}
