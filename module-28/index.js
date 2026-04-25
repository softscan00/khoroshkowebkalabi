/**
 * Модуль 28: Работа с файлами (fs)
 *
 * Задание: Создайте JSON-хранилище данных.
 */

const fs = require('fs');
const path = require('path');

/**
 * createStore — создаёт хранилище с сохранением в JSON-файл
 *
 * @param {string} filepath - путь к JSON-файлу
 * @returns {Object} - объект с методами: getAll, getById, add, update, remove
 */
function createStore(filepath) {
  // Внутренний массив данных (приватный)
  let data = [];

  
  function load() {
    if (fs.existsSync(filepath)) {
      const raw = fs.readFileSync(filepath, 'utf-8');
      data = JSON.parse(raw);
    } else {
      data = [];
    }
  }

  
  function save() {
    const json = JSON.stringify(data, null, 2);
    fs.writeFileSync(filepath, json);
  }

 
  function getNextId() {
    if (data.length === 0) return 1;
    return Math.max(...data.map(item => item.id)) + 1;
  }

  
  load();

  
  return {
    /**
     * getAll — возвращает все записи
     */
    getAll() {
      return data;
    },

    /**
     * getById — возвращает запись по id или null
     */
    getById(id) {
      return data.find(item => item.id === id) || null;
    },

    /**
     * add — добавляет новую запись с авто-инкрементом id
     */
    add(item) {
      const newItem = {
        id: getNextId(),
        ...item 
      };
      data.push(newItem);
      save(); 
      return newItem;
    },

    /**
     * update — обновляет запись по id
     */
    update(id, changes) {
      const index = data.findIndex(item => item.id === id);
      if (index === -1) return null;  // не найдено

      // Мержим изменения через Object.assign
      data[index] = Object.assign({}, data[index], changes);
      save();  // сохраняем в файл
      return data[index];
    },

    /**
     * remove — удаляет запись по id
     */
    remove(id) {
      const index = data.findIndex(item => item.id === id);
      if (index === -1) return false; 

      data.splice(index, 1); 
      save();  
      return true;
    }
  };
}

module.exports = { createStore };