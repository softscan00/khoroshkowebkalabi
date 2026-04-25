/**
 * Модуль 24: Routing и параметры URL
 *
 * Задание: Парсинг URL и сервер с динамическими маршрутами.
 */

const http = require('http');

// Данные для сервера
const users = [
  { id: 1, name: 'Ivan' },
  { id: 2, name: 'Maria' },
  { id: 3, name: 'Peter' },
  { id: 4, name: 'Anna' },
  { id: 5, name: 'Alex' }
];

/**
 * parseUrl — парсит URL на pathname и query
 *
 * @param {string} urlString - строка URL (например, '/api/users?page=1')
 * @returns {{ pathname: string, query: object }}
 */
function parseUrl(urlString) {
  const url = new URL(urlString, 'http://localhost');

  return {
    pathname: url.pathname,
    query: Object.fromEntries(url.searchParams)
  };
}

/**
 * extractId — извлекает числовой ID из пути
 *
 * @param {string} pathname - путь (например, '/users/123')
 * @param {string} prefix - префикс (например, '/users/')
 * @returns {number|null} - ID или null
 */
function extractId(pathname, prefix) {
  if (!pathname.startsWith(prefix)) return null;
  const idPart = pathname.slice(prefix.length);
  const id = parseInt(idPart, 10);
  return isNaN(id) ? null : id;
}

/**
 * createServer — создаёт HTTP-сервер с API
 *
 * Эндпоинты:
 * - GET /api/users — список (пагинация: ?page=1&limit=10)
 * - GET /api/users/:id — пользователь по ID
 * - Остальное — 404
 *
 * @returns {http.Server}
 */
function createServer() {
  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const { pathname, query } = parseUrl(req.url);
    if (pathname === '/api/users') {
      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || users.length;
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedUsers = users.slice(start, end);
      res.end(JSON.stringify(paginatedUsers));
      return;
    }
    if (pathname.startsWith('/api/users/')) {
      const id = extractId(pathname, '/api/users/');
      if (id) {
        const user = users.find(u => u.id === id);
        if (user) {
          res.end(JSON.stringify(user));
        } else {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'User not found' }));
        }
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Invalid user ID' }));
      }
      return;
    }
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));
  });
  
  return server;
}

module.exports = { parseUrl, extractId, createServer, users };
