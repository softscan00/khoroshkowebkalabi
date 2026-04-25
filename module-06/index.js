/**
 * Модуль 6: Методы массивов (push, pop, shift, unshift)
 *
 * Задание: Создайте две функции для ротации массива:
 * - rotateLeft(arr) — сдвигает влево (первый → в конец)
 * - rotateRight(arr) — сдвигает вправо (последний → в начало)
 */

/**
 * Сдвигает массив влево: первый элемент перемещается в конец.
 * @param {Array} arr - исходный массив (изменяется)
 * @returns {*} перемещённый элемент или undefined для пустого массива
 */
function rotateLeft(arr) {
    temp=arr.shift()
    arr.push(temp)
    return temp
}

/**
 * Сдвигает массив вправо: последний элемент перемещается в начало.
 * @param {Array} arr - исходный массив (изменяется)
 * @returns {*} перемещённый элемент или undefined для пустого массива
 */
function rotateRight(arr) {
    temp=arr.pop()
    arr.unshift(temp)
    return temp
}

module.exports = { rotateLeft, rotateRight };
