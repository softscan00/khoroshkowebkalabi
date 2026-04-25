/**
 * Модуль 29: Express — фреймворк для сервера
 *
 * Задание: Перепишите TODO API на Express.
 *
 * Установка: npm install express
 */

const express = require('express');

/**
 * createApp — создаёт Express-приложение с TODO API
 *
 * @returns {express.Application}
 */
function createApp() {
  const app = express();
  const todos = [];
  let nextId = 1;

  
  app.use(express.json());

  
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  
  app.get('/api/todos', (req, res) => {
    res.json(todos);
  });

  
  app.get('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(todo);
  });

  
  app.post('/api/todos', (req, res) => {
    const { title } = req.body;
    
    const newTodo = {
      id: nextId++,
      title,
      completed: false
    };
    
    todos.push(newTodo);
    res.status(201).json(newTodo);
  });

  
  app.patch('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    // Toggle completed
    todo.completed = !todo.completed;
    
    res.json(todo);
  });

  
  app.delete('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = todos.findIndex(t => t.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    todos.splice(index, 1);
    res.sendStatus(204);  // 204 = No Content (без тела ответа)
  });

  return app;
}

module.exports = { createApp };