import React from 'react';

export default function ShareButton({ post }) {
  const url = typeof window !== 'undefined' ? `${window.location.origin}/blogs/${post.id}` : `/blogs/${post.id}`;

  const doShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, text: post.body, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      alert('Enlace copiado al portapapeles');
    } catch (e) {
      console.error('Error compartiendo', e);
      alert('No se pudo compartir/copiar el enlace');
    }
  };

  return (
    <button className="btn btn-sm btn-outline-primary" onClick={doShare} title="Compartir">
      <i className="bi bi-share-fill"></i>
    </button>
  );
}
