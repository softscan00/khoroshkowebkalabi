/**
 * Модуль 4: Циклы (for, while)
 *
 * Задание: Напишите функцию sumArray, которая суммирует элементы массива
 * используя цикл for.
 *
 * @param {number[]} arr - Массив чисел для суммирования
 * @returns {number} Сумма всех элементов массива
 *
 * Примеры:
 * sumArray([1, 2, 3, 4, 5]) → 15
 * sumArray([10, 20, 30]) → 60
 * sumArray([]) → 0
 */

function sumArray(arr) {
    if (arr.length===0) 
        return 0
    let sum = 0
    for (let i=0; i<arr.length; i++) {
        sum+=arr[i]
    }
    return sum
}

module.exports = sumArray;
