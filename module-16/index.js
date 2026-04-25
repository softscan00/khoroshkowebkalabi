/**
 * fetchSequential — последовательно выполняет массив async-функций
 *
 * @param {Function[]} tasks - массив функций, возвращающих Promise
 * @returns {Promise<Array>} Promise с массивом результатов
 */
async function fetchSequential(tasks) {
  let a = []
  for (i of tasks) {
    a.push(await i())
  }
  return a
}

module.exports = { fetchSequential };
