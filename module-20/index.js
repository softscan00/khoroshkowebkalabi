/**
 * Модуль 20: Формы и валидация
 *
 * Задание: Напишите функции для сбора и валидации данных формы.
 */

/**
 * getFormData — собирает данные из формы в объект
 *
 * @param {string} selector - CSS-селектор формы
 * @returns {Object|null} - объект с данными или null если форма не найдена
 */
function getFormData(selector) {
    const form = document.querySelector(selector);
    if (!form) {
        return null;
    }
    const formData = new FormData(form);
    return Object.fromEntries(formData);
}

/**
 * validateForm — валидирует данные формы
 *
 * @param {Object} data - объект с полями username, email, password
 * @returns {Object} - { isValid: boolean, errors: object }
 */
function validateForm(data) {
  a = {
    isValid:Boolean,
    errors:Object
  }
  a.errors={}
  a.isValid=true
  if (data.username.length<3) {
    a.errors.username="Минимум 3 символа"
    a.isValid=false
  }
  if (!(
    (data.email.indexOf("@")!==-1) && 
    (data.email.indexOf(".")!==-1)
  )) {
    a.errors.email="Некорректный email"
    a.isValid=false
  }
  if (data.password.length<8) {
    a.errors.password="Минимум 8 символов"
    a.isValid=false
  }
  return a
}

// Экспорт для Node.js (тесты) и браузера
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getFormData, validateForm };
}
if (typeof window !== 'undefined') {
  window.getFormData = getFormData;
  window.validateForm = validateForm;
}
