/**
 * Модуль 27: TODO-приложение — Backend
 *
 * Задание: Создайте сервер с TODO API.
 */

const http = require('http');

/**
 * getBody — читает JSON из запроса
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
 * createServer — создаёт HTTP-сервер с TODO API
 *
 * Эндпоинты:
 * - GET    /api/todos     — список задач
 * - POST   /api/todos     — создать { title } → 201
 * - PATCH  /api/todos/:id — переключить completed → 200
 * - DELETE /api/todos/:id — удалить → 204
 * - OPTIONS *             — preflight → 204
 * - Остальное             → 404
 *
 * Все ответы с CORS-заголовками.
 *
 * @returns {http.Server}
 */
function createServer() {
  // Данные хранятся в памяти
  const todos = [];
  let nextId = 1;

  // Функция для чтения body из запроса
  function getBody(req) {
    return new Promise((resolve, reject) => {
      let body = '';
      
      req.on('data', (chunk) => {
        body += chunk;
      });
      
      req.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch (error) {
          reject(new Error('Invalid JSON'));
        }
      });
      
      req.on('error', reject);
    });
  }

  const server = http.createServer(async (req, res) => {
    // Добавляем CORS заголовки для всех ответов
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Обработка preflight запросов
    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }
    
    // Устанавливаем Content-Type для JSON ответов
    res.setHeader('Content-Type', 'application/json');
    
    // Парсим URL
    const url = new URL(req.url, 'http://localhost');
    const pathname = url.pathname;
    
    try {
      // GET /api/todos — получить все задачи
      if (req.method === 'GET' && pathname === '/api/todos') {
        res.end(JSON.stringify(todos));
        return;
      }
      
      // POST /api/todos — создать новую задачу
      if (req.method === 'POST' && pathname === '/api/todos') {
        const body = await getBody(req);
        
        // Проверяем наличие title
        if (!body.title || typeof body.title !== 'string') {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Title is required and must be a string' }));
          return;
        }
        
        const title = body.title.trim();
        if (title === '') {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Title cannot be empty' }));
          return;
        }
        
        // Создаем новую задачу
        const newTodo = {
          id: nextId++,
          title: title,
          completed: false
        };
        
        todos.push(newTodo);
        
        // 201 Created
        res.statusCode = 201;
        res.end(JSON.stringify(newTodo));
        return;
      }
      
      // PATCH /api/todos/:id — переключить completed
      if (req.method === 'PATCH' && pathname.startsWith('/api/todos/')) {
        // Извлекаем ID из URL
        const idPart = pathname.split('/').pop();
        const id = parseInt(idPart, 10);
        
        // Проверяем валидность ID
        if (isNaN(id)) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Invalid todo ID' }));
          return;
        }
        
        // Ищем задачу
        const todo = todos.find(t => t.id === id);
        
        if (!todo) {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Todo not found' }));
          return;
        }
        
        // Переключаем статус completed
        todo.completed = !todo.completed;
        
        // Возвращаем обновленную задачу
        res.end(JSON.stringify(todo));
        return;
      }
      
      // DELETE /api/todos/:id — удалить задачу
      if (req.method === 'DELETE' && pathname.startsWith('/api/todos/')) {
        // Извлекаем ID из URL
        const idPart = pathname.split('/').pop();
        const id = parseInt(idPart, 10);
        
        // Проверяем валидность ID
        if (isNaN(id)) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Invalid todo ID' }));
          return;
        }
        
        // Ищем индекс задачи
        const index = todos.findIndex(t => t.id === id);
        
        if (index === -1) {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Todo not found' }));
          return;
        }
        
        // Удаляем задачу
        todos.splice(index, 1);
        
        // 204 No Content
        res.statusCode = 204;
        res.end();
        return;
      }
      
      // Если ни один маршрут не подошел
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'Not found' }));
      
    } catch (error) {
      // Обработка ошибок
      console.error('Server error:', error);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  });
  
  return server;
}

module.exports = { createServer, getBody };
