import React, { useState } from 'react';
import { useEditor } from '@craftjs/core';

export default function Header() {
  const { enabled, actions, query } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');

  const handleExport = async () => {
    const json = query.serialize();
    console.log(json);
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(json);
      } else {
        const ta = document.createElement('textarea');
        ta.value = json;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
    } catch (e) {
      console.error('No se pudo copiar al portapapeles', e);
    }
  };

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

  // Importar/Cargar estado pegando JSON en un textarea
  const handleImport = () => {
    setImportError('');
    const raw = importText?.trim();
    if (!raw) {
      setImportError('Pega el JSON del estado antes de continuar.');
      return;
    }
    // Validar que sea JSON válido sin transformar el string
    try {
      JSON.parse(raw);
    } catch (e) {
      setImportError('El contenido no es un JSON válido.');
      return;
    }
    try {
      actions.deserialize(raw);
      setShowImport(false);
      setImportText('');
    } catch (e) {
      console.error('No se pudo cargar el estado', e);
      setImportError('No se pudo cargar el estado. Verifica que sea un JSON exportado por este editor.');
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
        <button type="button" className="btn btn-outline-primary" onClick={() => setShowImport(true)}>
          Cargar estado
        </button>
        <button type="button" className="btn btn-primary" onClick={handleExport}>
          Copiar Estado
        </button>
        <button type="button" className="btn btn-danger" onClick={handleClear}>
          Limpiar
        </button>
      </div>
  </div>
  {showImport && (
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{ background: 'rgba(0,0,0,0.35)', zIndex: 1050 }}
        onClick={() => setShowImport(false)}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Cargar estado</h5>
              <button type="button" className="btn-close" onClick={() => setShowImport(false)} />
            </div>
            <div className="modal-body">
              <label className="form-label">Pega aquí el JSON exportado</label>
              <textarea
                className="form-control"
                rows={12}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder='{"ROOT":{...}}'
              />
              {importError && <div className="alert alert-danger mt-3">{importError}</div>}
              <div className="form-text">Este JSON debe ser generado con el botón "Exportar".</div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowImport(false)}>
                Cancelar
              </button>
              <button type="button" className="btn btn-success" onClick={handleImport}>
                Cargar
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
