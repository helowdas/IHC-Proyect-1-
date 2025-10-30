import React, { useMemo, useState, useEffect } from 'react';
import { useEditor } from '@craftjs/core';

export default function Header() {
  const { enabled, actions, query } = useEditor((state) => ({
    enabled: state.options.enabled,
    totalNodes: Object.keys(state.nodes || {}).length,
  }));
  const [count, setCount] = useState(0);

  // keep count of nodes (excluding ROOT)
  const getCount = () => {
    const state = query.getState();
    const total = Object.keys(state.nodes || {}).length;
    return Math.max(0, total - 1);
  };

  useEffect(() => {
    setCount(getCount());
  });

  const handleExport = async () => {
    const json = query.serialize();
    // copy to clipboard
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(json);
      }
    } catch {}
    // trigger download
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'layout.json';
    a.click();
    URL.revokeObjectURL(url);
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

  return (
    <div className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom bg-white">
      <div className="d-flex align-items-center gap-3">
        <div className="h4 m-0 fw-bold">Constructor Web</div>
        <span className="badge text-bg-secondary">{count} elementos</span>
      </div>
      <div className="d-flex align-items-center gap-2">
        <button
          type="button"
          className={`btn btn-outline-secondary ${enabled ? '' : 'active'}`}
          onClick={() => actions.setOptions((opts) => (opts.enabled = !enabled))}
        >
          Vista Previa
        </button>
        <button type="button" className="btn btn-primary" onClick={handleExport}>
          Exportar
        </button>
        <button type="button" className="btn btn-danger" onClick={handleClear}>
          Limpiar
        </button>
      </div>
    </div>
  );
}
