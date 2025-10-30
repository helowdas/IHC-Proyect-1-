import React from 'react';
import { Element, useEditor } from '@craftjs/core';
import { Container } from '../user/Container';
import { Button } from '../user/Button';
import { Text } from '../user/Text';
import { Image } from '../user/Image';
import { Card } from '../user/Card';

export default function Palette() {
  const { connectors } = useEditor();
  return (
    <div className="p-3 border-end bg-body-tertiary" style={{ width: 280 }}>
      <div className="mb-3">
        <h5 className="mb-1">Componentes</h5>
        <small className="text-muted">Arrastra para agregar</small>
      </div>

      <div className="d-grid gap-2">
        <button
          ref={(ref) => ref && connectors.create(ref, <Text text="Texto" fontSize={18} />)}
          className="btn btn-light d-flex align-items-center gap-2 text-start"
          type="button"
        >
          <span className="bi bi-type">T</span> Texto
        </button>

        <button
          ref={(ref) => ref && connectors.create(ref, <Button size="small" variant="contained">Botón</Button>)}
          className="btn btn-light d-flex align-items-center gap-2 text-start"
          type="button"
        >
          <span className="bi bi-lightning">✦</span> Botón
        </button>

        <button
          ref={(ref) => ref && connectors.create(ref, <Image />)}
          className="btn btn-light d-flex align-items-center gap-2 text-start"
          type="button"
        >
          <span className="bi bi-image">🖼️</span> Imagen
        </button>

        <button
          ref={(ref) => ref && connectors.create(ref, <Element is={Container} padding={16} background="#ffffff" canvas />)}
          className="btn btn-light d-flex align-items-center gap-2 text-start"
          type="button"
        >
          <span className="bi bi-square">▢</span> Contenedor
        </button>

        <button
          ref={(ref) => ref && connectors.create(ref, <Element is={Card} />)}
          className="btn btn-light d-flex align-items-center gap-2 text-start"
          type="button"
        >
          <span className="bi bi-credit-card-2-front">💳</span> Tarjeta
        </button>
      </div>
    </div>
  );
}
