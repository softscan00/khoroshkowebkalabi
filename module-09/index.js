/**
 * createMultiplier — создаёт функцию-множитель (замыкание)
 *
 * @param {number} factor - на что умножать
 * @returns {Function} функция, которая принимает число и умножает его на factor
 */
function createMultiplier(factor) {
    return function(num) {
        return num * factor;
    };
}

/**
 * mergeObjects — объединяет два объекта с помощью spread оператора
 *
 * @param {Object} obj1 - первый объект
 * @param {Object} obj2 - второй объект (его свойства приоритетнее)
 * @returns {Object} новый объект с объединёнными свойствами
 */
function mergeObjects(obj1, obj2) {
    return { ...obj1, ...obj2 };
}

/**
 * createCounter — создаёт объект-счётчик с методами
 *
 * @param {number} initial - начальное значение (по умолчанию 0)
 * @returns {Object} объект со свойством value и методами increment, decrement, reset
 */
function createCounter(initial = 0) {
    const initialValue = initial;
    
    return {
        value: initial,
        
        increment() {
            this.value++;
            return this.value;
        },
        
        decrement() {
            this.value--;
            return this.value;
        },
        
        reset() {
            this.value = initialValue;
            return this.value;
        }
    };
}

module.exports = { createMultiplier, mergeObjects, createCounter };