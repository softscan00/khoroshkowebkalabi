/**
 * Модуль 22: Продвинутый Fetch — ошибки и параллельные запросы
 *
 * Задание: Напишите функции для безопасной работы с API.
 */

/**
 * fetchWithError — fetch с проверкой статуса
 *
 * @param {string} url - URL для запроса
 * @returns {Promise<any>} - JSON-данные
 * @throws {Error} - если response.ok === false, выбрасывает Error("HTTP {status}")
 */
async function fetchWithError(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * fetchAll — параллельная загрузка нескольких URL
 *
 * @param {string[]} urls - массив URL-адресов
 * @returns {Promise<any[]>} - массив JSON-данных
 * @throws {Error} - если любой запрос упал
 */
async function fetchAll(urls) {
  const promises = urls.map(url => fetchWithError(url));
  return await Promise.all(promises);
}

/**
 * fetchSafe — загрузка с обработкой частичных ошибок
 *
 * @param {string[]} urls - массив URL-адресов
 * @returns {Promise<{succeeded: any[], failed: Array<{url: string, error: string}>}>}
 */
async function fetchSafe(urls) {
  const promises = urls.map(url => fetchWithError(url));
  const results = await Promise.allSettled(promises);
  const succeeded = [];
  const failed = [];
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      succeeded.push(result.value);
    } else {
      failed.push({
        url: urls[index],
        error: result.reason.message
      });
    }
  });
  return { succeeded, failed };
}

// Экспорт
module.exports = { fetchWithError, fetchAll, fetchSafe };
