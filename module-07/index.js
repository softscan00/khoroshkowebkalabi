/**
 * Модуль 7: Объекты (создание, доступ к свойствам)
 *
 * Задание: Создайте две функции:
 * - createUser(name, age) — создаёт объект { name, age }
 * - formatUser(user) — возвращает строку "Имя: X, Возраст: Y"
 */

/**
 * Создаёт объект пользователя.
 * @param {string} name - имя пользователя
 * @param {number} age - возраст пользователя
 * @returns {Object} объект с полями name и age
 */
function createUser(name, age) {
    const user = { name: name, age: age }
    return user
    // Ваш код здесь
}

/**
 * Форматирует информацию о пользователе в строку.
 * @param {Object} user - объект с полями name и age
 * @returns {string} строка в формате "Имя: X, Возраст: Y"
 */
function formatUser(user) {
    let m = `Имя: ${user.name}, Возраст: ${user.age}`
    return m
}

module.exports = { createUser, formatUser };
