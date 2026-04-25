/**
 * Модуль 32: Финальный проект — Backend
 *
 * Задание: Express API для заметок.
 */

const express = require('express');

/**
 * createApp — создаёт Express-приложение
 *
 * @param {Object} store - хранилище с методами getAll, add, update, remove
 * @returns {express.Application}
 *
 * Эндпоинты:
 * - GET    /api/notes      — список
 * - POST   /api/notes      — создать { title, text } → 201
 * - PATCH  /api/notes/:id  — обновить { title?, text? }
 * - DELETE /api/notes/:id  — удалить → 204
 *
 * Middleware: express.json(), CORS
 */
function createApp(store) {
  const app = express();

  app.use(express.json());

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  app.get('/api/notes', (req, res) => {
    res.json(store.getAll());
  });

  app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    const note = {
      title,
      text,
      createdAt: new Date().toISOString()
    };
    const created = store.add(note);
    res.status(201).json(created);
  });

  app.patch('/api/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updated = store.update(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(updated);
  });

  app.delete('/api/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const removed = store.remove(id);
    if (!removed) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.sendStatus(204);
  });

  return app;
}


module.exports = { createApp };
