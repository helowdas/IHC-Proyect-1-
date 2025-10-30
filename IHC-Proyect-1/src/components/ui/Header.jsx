import React, { useState } from 'react';
import { useEditor } from '@craftjs/core';
import { saveSectionData } from '../../hooks/useSaveSectionData';

export default function Header({ nameSection }) {
  const { enabled, actions, query } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));
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
        <div className="h4 m-0 fw-bold">Constructor Web</div>
      </div>
      <div className="d-flex align-items-center gap-2">
        <button
          type="button"
          className={`btn btn-outline-secondary ${enabled ? '' : 'active'}`}
          onClick={() => actions.setOptions((opts) => (opts.enabled = !enabled))}
        >
          {enabled ? 'Desactivar' : 'Activar'} editor
        </button>

        <button type="button" className="btn btn-success d-flex justify-content-between align-items-center gap-2" onClick={handleSave} disabled={isSaving || !sectionName}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy-fill" viewBox="0 0 16 16">
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
