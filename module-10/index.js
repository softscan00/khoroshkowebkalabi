/**
 * getUnique — возвращает массив уникальных элементов
 *
 * @param {Array} arr - исходный массив
 * @returns {Array} массив без дубликатов
 */
function getUnique(arr) {
    return [...new Set(arr)];
}

/**
 * countItems — подсчитывает количество каждого элемента
 *
 * @param {Array} arr - исходный массив
 * @returns {Map} Map, где ключ — элемент, значение — количество
 */
function countItems(arr) {
    const map = new Map();
    
    for (const item of arr) {
        map.set(item, (map.get(item) || 0) + 1);
    }
    
    return map;
}

module.exports = { getUnique, countItems };