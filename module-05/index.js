/**
 * Модуль 5: Функции (declaration, expression, arrow)
 *
 * Задание: Создайте три функции разными способами:
 * - double (Function Declaration) — удваивает число
 * - triple (Function Expression) — утраивает число
 * - square (Arrow Function) — возводит в квадрат
 */

// Function Declaration — double
function double(n) {
    return 2*n
}

// Function Expression — triple
const triple = function(n) {
    return 3*n
};

// Arrow Function — square
const square = (n) => n*n;

module.exports = { double, triple, square };
