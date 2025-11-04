import React from 'react';

export default function CommentList({ comments = [] }) {
  if (!comments || comments.length === 0) return <div className="text-muted">Sin comentarios aún.</div>;
  return (
    <div className="list-group mb-3">
      {comments.map((c) => (
        <div key={c.id} className="list-group-item">
          <div className="d-flex justify-content-between">
            <strong>{c.author}</strong>
            <small className="text-muted">{new Date(c.createdAt).toLocaleString()}</small>
          </div>
          <div className="mt-1" style={{ whiteSpace: 'pre-wrap' }}>{c.text}</div>
        </div>
      ))}
    </div>
  );
}
