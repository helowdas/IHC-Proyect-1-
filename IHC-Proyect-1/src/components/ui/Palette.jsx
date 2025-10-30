import React, { useState } from 'react';
import { Element, useEditor } from '@craftjs/core';
import { Container } from '../user/Container';
import { Button } from '../user/Button';
import { Text } from '../user/Text';
import { Image } from '../user/Image';
import { Card } from '../user/Card';
import Sidebar from "./Sidebar";

export default function Palette() {
  const { connectors } = useEditor();
  const [view, setView] = useState('componentes'); // 'componentes' | 'sidebar'
  return (
    <div className="p-3 border-end bg-body-tertiary" style={{ width: 300 }}>
      {/* Toggle buttons */}
      <div className="d-flex gap-2 mb-2">
        <button
          type="button"
          className={`btn btn-sm ${view === 'componentes' ? 'btn-a50104' : 'btn-outline-a50104'}`}
          onClick={() => setView('componentes')}
        >
          Componentes
        </button>
        <button
          type="button"
          className={`btn btn-sm ${view === 'sidebar' ? 'btn-a50104' : 'btn-outline-a50104'}`}
          onClick={() => setView('sidebar')}
        >
          Secciones
        </button>
      </div>
      <hr />

      {view === 'componentes' ? (
        <>
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
              <span className="bi bi-type"></span> Texto
            </button>

            <button
              ref={(ref) => ref && connectors.create(ref, <Button size="small" variant="contained">Botón</Button>)}
              className="btn btn-light d-flex align-items-center gap-2 text-start"
              type="button"
            >
              <span className="bi bi-lightning"></span> Botón
            </button>

            <button
              ref={(ref) => ref && connectors.create(ref, <Image />)}
              className="btn btn-light d-flex align-items-center gap-2 text-start"
              type="button"
            >
              <span className="bi bi-image"></span> Imagen
            </button>

            <button
              ref={(ref) => ref && connectors.create(ref, <Element is={Container} padding={16} background="#ffffff" canvas />)}
              className="btn btn-light d-flex align-items-center gap-2 text-start"
              type="button"
            >
              <span className="bi bi-square"></span> Contenedor
            </button>

            <button
              ref={(ref) => ref && connectors.create(ref, <Element is={Card} />)}
              className="btn btn-light d-flex align-items-center gap-2 text-start"
              type="button"
            >
              <span className="bi bi-credit-card-2-front"></span> Tarjeta
            </button>
          </div>
        </>
      ) : (
        <Sidebar />
      )}
    </div>
  );
}
