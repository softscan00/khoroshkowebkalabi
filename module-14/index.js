/**
 * executeInOrder — выполняет три функции последовательно с задержками
 *
 * @param {Function} first - выполняется через 0 мс
 * @param {Function} second - выполняется через 100 мс
 * @param {Function} third - выполняется через 200 мс
 * @returns {Object} объект с методом cancel() для отмены таймеров
 */
function executeInOrder(first, second, third) {
  let a = []
  a.push(setTimeout(first, 0))
  a.push(setTimeout(second, 100))
  a.push(setTimeout(third, 200))
  return {
    cancel: function() {
      a.forEach(i => {
        clearTimeout(i)
      })
      return
    }
  }
}

module.exports = { executeInOrder };
