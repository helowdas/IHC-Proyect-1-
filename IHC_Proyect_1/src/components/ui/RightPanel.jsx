import React, { useState } from 'react';
import { useEditor } from '@craftjs/core';
import { Layers } from '@craftjs/layers';
import SettingsLite from './SettingsLite';

export default function RightPanel() {
  const { currentNodeId } = useEditor((state) => {
    const [id] = state.events.selected || [];
    return { currentNodeId: id };
  });
  const [view, setView] = useState('personalizacion'); // 'personalizacion' | 'capas'

  return (
    <div className="p-3 border-start bg-body-tertiary" style={{ width: 280, overflowX: 'visible', minWidth: 280 }}>
      {/* Toggle buttons */}
      <div className="d-flex gap-2 mb-2">
        <button
          type="button"
          className={`btn btn-sm ${view === 'personalizacion' ? 'btn-a50104' : 'btn-outline-a50104'}`}
          onClick={() => setView('personalizacion')}
        >
          Personalización
        </button>
        <button
          type="button"
          className={`btn btn-sm ${view === 'capas' ? 'btn-a50104' : 'btn-outline-a50104'}`}
          onClick={() => setView('capas')}
        >
          Capas
        </button>
      </div>
      <hr />

      {view === 'personalizacion' ? (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
          {currentNodeId ? (
            <SettingsLite />
          ) : (
            <div className="text-center text-muted p-4">
              <p className="mb-0">Selecciona un elemento para personalizarlo</p>
            </div>
          )}
        </div>
      ) : (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
          <Layers expandRootOnLoad={true} />
        </div>
      )}
    </div>
  );
}

