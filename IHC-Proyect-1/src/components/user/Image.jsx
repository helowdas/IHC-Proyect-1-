import React from 'react';
import { useNode } from '@craftjs/core';

export const Image = ({ src = 'https://placehold.co/1200x500', alt = 'Imagen', width = 100, fit = 'cover' }) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div ref={(ref) => connect(drag(ref))}>
      <img
        src={src}
        alt={alt}
        style={{ display: 'block', width: `${width}%`, height: 'auto', objectFit: fit, borderRadius: 4 }}
      />
    </div>
  );
};

Image.craft = {
  props: { src: 'https://placehold.co/1200x500', alt: 'Imagen', width: 100, fit: 'cover' },
};
