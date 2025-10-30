import React, { useMemo } from 'react';
import { useEditor } from '@craftjs/core';

export default function SettingsLite() {
  const { selected, actions, query } = useEditor((state, query) => {
    const [id] = state.events.selected || [];
    if (!id) return { selected: null };
    const node = state.nodes[id];
    return {
      selected: {
        id,
        name: node.data.name,
        props: node.data.props,
      },
    };
  });

  if (!selected) {
    return (
      <div className="p-4 text-center text-muted">
        <p className="m-0 fw-semibold">Selecciona un elemento</p>
        <small>para editar sus propiedades</small>
      </div>
    );
  }

  const onProp = (key, value) => {
    actions.setProp(selected.id, (props) => {
      props[key] = value;
    });
  };

  const name = selected.name;
  const props = selected.props || {};

  return (
    <div className="p-3" style={{ width: 320 }}>
      <div className="mb-3 d-flex align-items-center justify-content-between">
        <div className="fw-semibold">{name}</div>
        <span className="badge text-bg-primary">Settings</span>
      </div>

      {/* TEXT */}
      {name === 'Text' && (
        <div className="d-grid gap-3">
          <div>
            <label className="form-label">Texto</label>
            <input
              className="form-control form-control-sm"
              type="text"
              value={props.text ?? ''}
              onChange={(e) => onProp('text', e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Tamaño de fuente</label>
            <input
              type="range"
              className="form-range"
              min={8}
              max={64}
              step={1}
              value={typeof props.fontSize === 'number' ? props.fontSize : 20}
              onChange={(e) => onProp('fontSize', Number(e.target.value))}
            />
            <div className="small text-muted">{props.fontSize ?? 20}px</div>
          </div>
        </div>
      )}

      {/* BUTTON */}
      {name === 'Button' && (
        <div className="d-grid gap-3">
          <div>
            <label className="form-label">Tamaño</label>
            <select
              className="form-select form-select-sm"
              value={props.size || 'small'}
              onChange={(e) => onProp('size', e.target.value)}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <div>
            <label className="form-label">Variante</label>
            <select
              className="form-select form-select-sm"
              value={props.variant || 'contained'}
              onChange={(e) => onProp('variant', e.target.value)}
            >
              <option value="text">Text</option>
              <option value="outlined">Outlined</option>
              <option value="contained">Contained</option>
            </select>
          </div>
          <div>
            <label className="form-label">Color</label>
            <select
              className="form-select form-select-sm"
              value={props.color || 'primary'}
              onChange={(e) => onProp('color', e.target.value)}
            >
              <option value="inherit">inherit</option>
              <option value="primary">primary</option>
              <option value="secondary">secondary</option>
            </select>
          </div>
        </div>
      )}

      {/* CONTAINER */}
      {name === 'Container' && (
        <div className="d-grid gap-3">
          <div>
            <label className="form-label">Fondo</label>
            <input
              type="color"
              className="form-control form-control-color"
              value={props.background || '#ffffff'}
              onChange={(e) => onProp('background', e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Padding</label>
            <input
              type="range"
              className="form-range"
              min={0}
              max={100}
              step={1}
              value={typeof props.padding === 'number' ? props.padding : 3}
              onChange={(e) => onProp('padding', Number(e.target.value))}
            />
            <div className="small text-muted">{props.padding ?? 3}px</div>
          </div>
        </div>
      )}

      {/* IMAGE */}
      {name === 'Image' && (
        <div className="d-grid gap-3">
          <div>
            <label className="form-label">URL de la imagen</label>
            <input
              className="form-control form-control-sm"
              type="text"
              value={props.src ?? ''}
              onChange={(e) => onProp('src', e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="form-label">Texto alternativo</label>
            <input
              className="form-control form-control-sm"
              type="text"
              value={props.alt ?? ''}
              onChange={(e) => onProp('alt', e.target.value)}
              placeholder="Descripción"
            />
          </div>
          <div>
            <label className="form-label">Ancho (%)</label>
            <input
              type="range"
              className="form-range"
              min={10}
              max={100}
              step={1}
              value={typeof props.width === 'number' ? props.width : 100}
              onChange={(e) => onProp('width', Number(e.target.value))}
            />
            <div className="small text-muted">{props.width ?? 100}%</div>
          </div>
          <div>
            <label className="form-label">Ajuste</label>
            <select
              className="form-select form-select-sm"
              value={props.fit || 'cover'}
              onChange={(e) => onProp('fit', e.target.value)}
            >
              <option value="contain">contain</option>
              <option value="cover">cover</option>
              <option value="fill">fill</option>
              <option value="none">none</option>
              <option value="scale-down">scale-down</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
