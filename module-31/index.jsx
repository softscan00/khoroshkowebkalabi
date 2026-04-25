/**
 * Модуль 31: React + Fetch
 *
 * Задание: Создайте компоненты, которые работают с API.
 */

import { useState, useEffect } from 'react';

/**
 * PostList — загружает и отображает список постов
 *
 * @param {Object} props
 * @param {string} props.url - базовый URL API
 */
export function PostList({ url }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Создаём async функцию внутри useEffect
    async function fetchPosts() {
      try {
        const response = await fetch(`${url}/api/posts`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        setPosts(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [url]);

  
  if (loading) {
    return <p data-testid="loading">Загрузка...</p>;
  }

  
  if (error) {
    return <p data-testid="error">Ошибка: {error}</p>;
  }

  
  return (
    <ul data-testid="posts">
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}

/**
 * AddPostForm — форма для создания поста
 *
 * @param {Object} props
 * @param {string} props.url - базовый URL API
 * @param {Function} props.onAdd - колбэк после создания поста
 */
export function AddPostForm({ url, onAdd }) {
  const [title, setTitle] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(`${url}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title })
      });

      const newPost = await response.json();
      
     
      onAdd(newPost);
      
     
      setTitle('');
    } catch (err) {
      console.error('Ошибка при создании поста:', err);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Заголовок поста"
      />
      <button type="submit">Добавить</button>
    </form>
  );
}