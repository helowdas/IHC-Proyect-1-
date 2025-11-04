import React from 'react';

export default function ReactionButtons({ reactions = {}, onReact }) {
  const kinds = ['like', 'love', 'clap'];
  return (
    <div className="d-flex gap-2 mb-3">
      {kinds.map((k) => (
        <button key={k} className="btn btn-sm btn-outline-secondary" onClick={() => onReact && onReact(k)}>
          <i className={`bi ${k === 'like' ? 'bi-hand-thumbs-up' : k === 'love' ? 'bi-heart-fill' : 'bi-hand-clap'}`}></i>
          <span className="ms-2">{reactions[k] || 0}</span>
        </button>
      ))}
    </div>
  );
}
