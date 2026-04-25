/**
 * Модуль 25: POST-запросы и тело запроса
 *
 * Задание: Чтение body и CRUD API для пользователей.
 */

const http = require('http');

/**
 * getBody — читает и парсит JSON из запроса
 *
 * @param {http.IncomingMessage} req - объект запроса
 * @returns {Promise<any>} - распарсенный JSON
 */
function getBody(req) {
  a = new Promise((resolve, reject) => {
    let body = '';

    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
  return a
}
/**
 * createServer — создаёт HTTP-сервер с CRUD API
 *
 * Эндпоинты:
 * - GET /api/users — список пользователей
 * - POST /api/users — создать (body: { name }) → 201
 * - DELETE /api/users/:id — удалить → 204 или 404
 * - Остальное → 404
 *
 * @returns {http.Server}
 */
function createServer() {
  // Данные хранятся в замыкании
  const users = [];
  let nextId = 1;

  const server = http.createServer(async (req, res) => {
    // Устанавливаем заголовок для всех JSON ответов
    res.setHeader('Content-Type', 'application/json');
    
    // Парсим URL для получения pathname
    const url = new URL(req.url, 'http://localhost');
    const pathname = url.pathname;

    if (req.method === 'GET' && pathname === '/api/users') {
      res.end(JSON.stringify(users));
      return;
    }
    
    if (req.method === 'POST' && pathname === '/api/users') {
      const body = await getBody(req);
      
      const newUser = {
        id: nextId++,
        name: body.name.trim()
      };
      
      users.push(newUser);
      
      res.statusCode = 201;
      res.end(JSON.stringify(newUser));
      return;
    }
    
    if (req.method === 'DELETE' && pathname.startsWith('/api/users/')) {
      const idPart = pathname.split('/').pop();
      const id = parseInt(idPart, 10);
              
      const index = users.findIndex(user => user.id === id);
      
      if (index === -1) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'User not found' }));
        return;
      }
      
      users.splice(index, 1);
      
      res.statusCode = 204;
      res.end();
      return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));
      
  });
  
  return server;
}

module.exports = { getBody, createServer };
