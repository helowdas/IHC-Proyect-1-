// Hook simple para manejar posts, comentarios y reacciones usando localStorage
const STORAGE_KEY = 'ihc_blogs_v1';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || '[]';
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error parseando blogs desde localStorage', e);
    return [];
  }
}

function save(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function getAllBlogs() {
  return load();
}

export function getBlog(id) {
  const items = load();
  return items.find((b) => b.id === id) || null;
}

export function createBlog({ title, body, image }) {
  const items = load();
  const newItem = {
    id: generateId(),
    title: title || 'Sin título',
    body: body || '',
    image: image || null,
    comments: [],
    reactions: { like: 0, love: 0, clap: 0 },
    createdAt: new Date().toISOString(),
  };
  items.unshift(newItem);
  save(items);
  return newItem;
}

export function updateBlog(id, patch) {
  const items = load();
  const idx = items.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...patch };
  save(items);
  return items[idx];
}

export function deleteBlog(id) {
  const items = load().filter((b) => b.id !== id);
  save(items);
}

export function addComment(id, { author, text }) {
  const items = load();
  const idx = items.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  const comment = { id: generateId(), author: author || 'Anon', text, createdAt: new Date().toISOString() };
  items[idx].comments.push(comment);
  save(items);
  return comment;
}

export function toggleReaction(id, kind) {
  const items = load();
  const idx = items.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  const r = items[idx].reactions || { like: 0, love: 0, clap: 0 };
  if (!r[kind]) r[kind] = 0;
  r[kind] = r[kind] + 1; // para prototipo, solo incrementa
  items[idx].reactions = r;
  save(items);
  return r;
}

export default {
  getAllBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  addComment,
  toggleReaction,
};
