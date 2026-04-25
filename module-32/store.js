/**
 * Модуль 32: Финальный проект — Хранилище
 *
 * Задание: JSON-хранилище для заметок (как в модуле 28).
 */

const fs = require('fs');
const path = require('path');

/**
 * createStore — создаёт JSON-хранилище
 *
 * Хранилище отвечает только за базовые CRUD-операции:
 * getAll, add (с авто-id), update, remove.
 * Дополнительные поля (например, createdAt) добавляются на уровне сервера (server.js).
 *
 * @param {string} filepath - путь к JSON-файлу
 * @returns {Object} - { getAll, add, update, remove }
 */
function createStore(filepath) {
  let items = [];
  let nextId = 1;

  if (fs.existsSync(filepath)) {
    const data = fs.readFileSync(filepath, 'utf-8');
    items = JSON.parse(data);
    if (items.length > 0) {
      nextId = Math.max(...items.map(item => item.id)) + 1;
    }
  }

  function save() {
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filepath, JSON.stringify(items, null, 2));
  }

  return {
    getAll() {
      return [...items];
    },

    add(item) {
      const newItem = { ...item, id: nextId++ };
      items.push(newItem);
      save();
      return newItem;
    },

    update(id, changes) {
      const index = items.findIndex(item => item.id === id);
      if (index === -1) return null;
      items[index] = { ...items[index], ...changes };
      save();
      return items[index];
    },

    remove(id) {
      const index = items.findIndex(item => item.id === id);
      if (index === -1) return false;
      items.splice(index, 1);
      save();
      return true;
    }
  };
}


module.exports = { createStore };
