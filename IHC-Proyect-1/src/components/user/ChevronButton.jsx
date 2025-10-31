import React from 'react';
import { useNode } from '@craftjs/core';
import { useNavigate } from 'react-router-dom';

export const ChevronButton = ({
  to,
  sectionName,
  direction = 'left',
  size = 56,
  stroke = 8,
  color = '#E6E3A1',
  bg = 'transparent',
  rounded = true,
  title,
  ariaLabel,
  className = '',
  style = {},
  // Positioning
  translateX = 0,
  translateY = 0,
  opacity = 1,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    let target = to;
    if (!target && sectionName) {
      target = `/editor?section=${encodeURIComponent(sectionName)}`;
    }
    if (!target) return;

    if (typeof target === 'string' && target.startsWith('#')) {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    navigate(target);
  };

  const rotation =
    {
      left: 0,
      right: 180,
      up: -90,
      down: 90,
    }[direction] ?? 0;

  const btnStyle = {
    background: bg,
    border: 'none',
    width: size + 16,
    height: size + 16,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: rounded ? '9999px' : '8px',
    cursor: 'pointer',
    transform: `translate(${Number(translateX) || 0}px, ${Number(translateY) || 0}px)`,
    opacity: Math.max(0, Math.min(1, Number(opacity) || 0)),
    ...style,
  };

  return (
    <button
      ref={(ref) => connect(drag(ref))}
      type="button"
      onClick={handleClick}
      title={title}
      aria-label={ariaLabel || title || 'Ir'}
      className={`btn p-0 ${className}`}
      style={btnStyle}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 56 56"
        role="img"
        aria-hidden="true"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <polyline
          points="34,12 18,28 34,44"
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

const ChevronButtonSettings = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((node) => ({ props: node.data.props }));

  return (
    <div className="d-grid gap-3">
      <div>
        <label className="form-label">Opacidad</label>
        <input
          className="form-range"
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={Number.isFinite(props.opacity) ? props.opacity : 1}
          onChange={(e) => setProp((p) => (p.opacity = Number(e.target.value)))}
        />
        <div className="small text-muted">{(props.opacity ?? 1).toFixed(2)}</div>
      </div>
      <div className="row g-2">
        <div className="col-6">
          <label className="form-label">Mover X (px)</label>
          <input
            className="form-control form-control-sm"
            type="number"
            value={Number.isFinite(props.translateX) ? props.translateX : 0}
            onChange={(e) => setProp((p) => (p.translateX = Number(e.target.value)))}
          />
        </div>
        <div className="col-6">
          <label className="form-label">Mover Y (px)</label>
          <input
            className="form-control form-control-sm"
            type="number"
            value={Number.isFinite(props.translateY) ? props.translateY : 0}
            onChange={(e) => setProp((p) => (p.translateY = Number(e.target.value)))}
          />
        </div>
      </div>
      <div>
        <label className="form-label">Nombre de sección</label>
        <input
          className="form-control form-control-sm"
          type="text"
          value={props.sectionName ?? ''}
          onChange={(e) => setProp((p) => (p.sectionName = e.target.value))}
          placeholder="Landing"
        />
      </div>
      <div>
        <label className="form-label">Dirección</label>
        <select
          className="form-select form-select-sm"
          value={props.direction || 'left'}
          onChange={(e) => setProp((p) => (p.direction = e.target.value))}
        >
          <option value="left">Izquierda</option>
          <option value="right">Derecha</option>
          <option value="up">Arriba</option>
          <option value="down">Abajo</option>
        </select>
      </div>
      <div className="row g-2">
        <div className="col-6">
          <label className="form-label">Tamaño (px)</label>
          <input
            className="form-control form-control-sm"
            type="number"
            min={24}
            max={128}
            value={Number.isFinite(props.size) ? props.size : 56}
            onChange={(e) => setProp((p) => (p.size = Number(e.target.value)))}
          />
        </div>
        <div className="col-6">
          <label className="form-label">Grosor</label>
          <input
            className="form-control form-control-sm"
            type="number"
            min={2}
            max={16}
            value={Number.isFinite(props.stroke) ? props.stroke : 8}
            onChange={(e) => setProp((p) => (p.stroke = Number(e.target.value)))}
          />
        </div>
      </div>
      <div className="row g-2">
        <div className="col-6">
          <label className="form-label">Color</label>
          <input
            type="color"
            className="form-control form-control-color"
            value={props.color || '#E6E3A1'}
            onChange={(e) => setProp((p) => (p.color = e.target.value))}
          />
        </div>
        <div className="col-6">
          <label className="form-label">Fondo</label>
          <input
            type="color"
            className="form-control form-control-color"
            value={props.bg || '#00000000'}
            onChange={(e) => setProp((p) => (p.bg = e.target.value))}
          />
        </div>
      </div>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="chev-rounded"
          checked={!!props.rounded}
          onChange={(e) => setProp((p) => (p.rounded = e.target.checked))}
        />
        <label className="form-check-label" htmlFor="chev-rounded">
          Bordes redondeados
        </label>
      </div>
    </div>
  );
};

ChevronButton.craft = {
  props: {
    to: '',
    sectionName: '',
    direction: 'left',
    size: 56,
    stroke: 8,
    color: '#E6E3A1',
    bg: 'transparent',
    rounded: true,
    title: '',
    ariaLabel: '',
    className: '',
    style: {},
    translateX: 0,
    translateY: 0,
    opacity: 1,
  },
  related: {
    settings: ChevronButtonSettings,
  },
};
