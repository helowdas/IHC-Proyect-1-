import React, { useState } from 'react';

export default function CommentForm({ onSubmit }) {
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');

  const handle = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit({ author: author.trim() || 'Anon', text: text.trim() });
    setAuthor('');
    setText('');
  };

  return (
    <form onSubmit={handle} className="mt-3">
      <div className="mb-2">
        <input className="form-control form-control-sm" placeholder="Tu nombre (opcional)" value={author} onChange={(e) => setAuthor(e.target.value)} />
      </div>
      <div className="mb-2">
        <textarea className="form-control form-control-sm" rows={3} placeholder="Tu comentario" value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <div>
        <button className="btn btn-sm btn-primary" type="submit">Comentar</button>
      </div>
    </form>
  );
}
