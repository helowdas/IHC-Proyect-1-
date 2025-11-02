import React, { useState } from 'react';
import { useEditor } from '@craftjs/core';
import { useNavigate } from 'react-router-dom';
import { saveSectionData } from '../../hooks/useSaveSectionData';
import { useUndoHistory } from '../../hooks/useUndoHistory';

export default function Header({ nameSection }) {
  const navigate = useNavigate();
  const { enabled, actions, query } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));
  const { undo, canUndo } = useUndoHistory();
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const sectionName = nameSection || '';

  const handleClear = () => {
    if (!confirm('¿Limpiar el lienzo? Esta acción borrará el contenido.')) return;
    // Empty ROOT keeping it as canvas
    const emptyTree = {
      ROOT: {
        type: { resolvedName: 'Container' },
        isCanvas: true,
        props: { padding: 5, background: '#f5f5f5' },
        displayName: 'Container',
        custom: {},
        hidden: false,
        nodes: [],
        linkedNodes: {},
      },
    };
    actions.deserialize(JSON.stringify(emptyTree));
  };

  // Guardar estado en Supabase y bloquear el editor mientras guarda
  const handleSave = async () => {
    try {
      if (!sectionName) {
        alert('No hay nombre de sección (prop nameSection).');
        return;
      }
      setIsSaving(true);
      actions.setOptions((opts) => (opts.enabled = false));
      const json = query.serialize();
      console.log('Saving section:', sectionName, json);
      await saveSectionData(sectionName, json);
    } catch (e) {
      console.error('Error al guardar la sección', e);
      alert('No se pudo guardar. Revisa la consola para más detalles.');
    } finally {
      // Al terminar, activar el editor
      actions.setOptions((opts) => (opts.enabled = true));
      setIsSaving(false);
    }
  };

  return (
    <>
    <div className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom bg-white">
      <div className="d-flex align-items-center gap-3">
        <button 
          type="button" 
          className="btn btn-link text-decoration-none p-0"
          onClick={() => navigate('/')}
        >
          <div className="h4 m-0 fw-bold">Ágora</div>
        </button>
      </div>
      <div className="d-flex align-items-center gap-2">
        <button
          type="button"
          className={`btn btn-outline-secondary ${enabled ? '' : 'active'}`}
          onClick={() => actions.setOptions((opts) => (opts.enabled = !enabled))}
        >
          {enabled ? 'Desactivar' : 'Activar'} editor
        </button>

        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={undo}
          disabled={!canUndo}
          title="Retroceder (Ctrl+Z)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-counterclockwise" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
            <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
          </svg>
          Retroceder
        </button>

        <button type="button" className="btn btn-success d-flex justify-content-between align-items-center gap-2" onClick={handleSave} disabled={isSaving || !sectionName}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-floppy-fill" viewBox="0 0 16 16">
              <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0H3v5.5A1.5 1.5 0 0 0 4.5 7h7A1.5 1.5 0 0 0 13 5.5V0h.086a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5H14v-5.5A1.5 1.5 0 0 0 12.5 9h-9A1.5 1.5 0 0 0 2 10.5V16h-.5A1.5 1.5 0 0 1 0 14.5z"/>
              <path d="M3 16h10v-5.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5zm9-16H4v5.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5zM9 1h2v4H9z"/>
            </svg>
            {isSaving ? 'Guardando…' : 'Guardar'}
        </button>
      
        <button type="button" className="btn btn-danger" onClick={handleClear}>
          Limpiar
        </button>
      </div>
    </div>
  
    </>
  );
}
