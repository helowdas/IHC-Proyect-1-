import React, { useState } from 'react';
import { createBlog } from '../../../hooks/useBlogs';

export default function BlogEditor({ onCreated }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageData, setImageData] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleImage = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setImageData(reader.result);
    reader.readAsDataURL(f);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    const item = createBlog({ title, body, image: imageData });
    setTitle('');
    setBody('');
    setImageData(null);
    setSaving(false);
    if (onCreated) onCreated(item);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <div className="mb-2">
        <input className="form-control form-control-sm" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="mb-2">
        <textarea className="form-control form-control-sm" rows={5} placeholder="Contenido" value={body} onChange={(e) => setBody(e.target.value)} />
      </div>
      <div className="mb-2">
        <input type="file" accept="image/*" className="form-control form-control-sm" onChange={handleImage} />
      </div>
      <div className="d-flex gap-2">
        <button className="btn btn-sm btn-primary" type="submit" disabled={saving}>{saving ? 'Creando…' : 'Crear post'}</button>
      </div>
    </form>
  );
}
