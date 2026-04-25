/**
 * Модуль 26: CORS — связка фронтенда и бэкенда
 *
 * Задание: Настройка CORS для кросс-доменных запросов.
 */

const http = require('http');

/**
 * addCorsHeaders — добавляет CORS-заголовки к ответу
 *
 * @param {http.ServerResponse} res - объект ответа
 */
function addCorsHeaders(res) {
  // Ваш код здесь
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

/**
 * handlePreflight — обрабатывает OPTIONS (preflight) запрос
 *
 * @param {http.IncomingMessage} req - объект запроса
 * @param {http.ServerResponse} res - объект ответа
 * @returns {boolean} - true если это был OPTIONS и он обработан
 */
function handlePreflight(req, res) {
  if (req.method==='OPTIONS') {
    addCorsHeaders(res)
    res.statusCode = 204;
    res.end();
    return true
  }
  else return false
}

/**
 * getBody — читает JSON из запроса (вспомогательная)
 */
function getBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(e);
      }
    });
  });
}

/**
 * createServer — создаёт HTTP-сервер с CORS
 *
 * Эндпоинты:
 * - OPTIONS * — preflight (204)
 * - GET /api/message → { message: "Hello from API" }
 * - POST /api/echo → возвращает полученный body
 * - Остальное → 404
 *
 * @returns {http.Server}
 */
function createServer() {
  const server = http.createServer(async (req, res) => {
    if (handlePreflight(req, res)) {
      return;
    }
    
    addCorsHeaders(res);
    
    res.setHeader('Content-Type', 'application/json');
    
    const url = new URL(req.url, 'http://localhost');
    const pathname = url.pathname;
    
    if (req.method === 'GET' && pathname === '/api/message') {
      res.end(JSON.stringify({ message: 'Hello from API' }));
      return;
    }
    
    if (req.method === 'POST' && pathname === '/api/echo') {
      try {
        const body = await getBody(req);
        res.end(JSON.stringify(body));
      } catch (error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
      return;
    }
    
    // Если ни один маршрут не подошел
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));
  });
  
  return server;
}

module.exports = { addCorsHeaders, handlePreflight, createServer, getBody };
