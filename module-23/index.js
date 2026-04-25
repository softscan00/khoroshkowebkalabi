/**
 * Модуль 23: Создание HTTP-сервера
 *
 * Задание: Создайте функцию createServer(), которая возвращает HTTP-сервер.
 */

const http = require('http');

/**
 * createServer — создаёт и возвращает HTTP-сервер
 *
 * Эндпоинты:
 * - GET /          → { message: "Welcome to API" }
 * - GET /api/health → { status: "ok" }
 * - GET /api/time   → { time: "<ISO string>" }
 * - Всё остальное  → 404 { error: "Not found" }
 *
 * @returns {http.Server}
 */
function createServer() {
  const http = require('http');

  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.method==="GET") {
      if (req.url === "/") {
        res.end(JSON.stringify({message: "Welcome to API"}))
      }
      else if (req.url==="/api/health") {
        res.end(JSON.stringify({status: "ok"}))
      }
      else if (req.url==="/api/time") {
        res.end(JSON.stringify({time: new Date().toISOString()}))
      }
      else {
        res.statusCode=404;
        res.end(JSON.stringify({error: "Not found"}))
      }
    }
  });
  return server
}

module.exports = { createServer };
