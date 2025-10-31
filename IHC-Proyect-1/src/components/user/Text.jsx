// components/user/Text.js
import React, { useEffect, useState, useRef } from "react";
import { useNode } from "@craftjs/core";

export const Text = ({ text, fontSize, fontClass, translateX = 0, translateY = 0, zIndex = 0, opacity = 1, textColor = '#000000', textShadowX = 0, textShadowY = 0, textShadowBlur = 0, textShadowColor = '#000000' }) => {
  const { connectors: { connect, drag },hasSelectedNode, hasDraggedNode, actions: { setProp } } = useNode((state) => ({
    hasSelectedNode: state.events.selected,
    hasDraggedNode: state.events.dragged
  }));

  const [editable, setEditable] = useState(false);
  useEffect(() => {!hasSelectedNode && setEditable(false)},[hasSelectedNode])

  // Handle de movimiento (misma estructura que Card, actualizando translateX/Y)
  const moveStart = useRef({ mx: 0, my: 0, x: Number(translateX) || 0, y: Number(translateY) || 0 });
  const onMoveMouseDown = (e) => {
    e.stopPropagation();
    moveStart.current = {
      mx: e.clientX,
      my: e.clientY,
      x: Number(translateX) || 0,
      y: Number(translateY) || 0,
    };

    const onMove = (ev) => {
      const dx = ev.clientX - moveStart.current.mx;
      const dy = ev.clientY - moveStart.current.my;
      setProp((p) => {
        p.translateX = Math.round((moveStart.current.x ?? 0) + dx);
        p.translateY = Math.round((moveStart.current.y ?? 0) + dy);
      }, 0);
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div 
      ref={ref => connect(drag(ref))}
      onClick={() => setEditable(true)}
      style={{ transform: `translate(${Number(translateX) || 0}px, ${Number(translateY) || 0}px)`, opacity: Math.max(0, Math.min(1, Number(opacity) || 0)), position: 'relative', zIndex: Number(zIndex) || 0 }}
    >
      <p
        className={fontClass || undefined}
        style={{
          fontSize,
          color: textColor || '#000000',
          textShadow: `${Number(textShadowX) || 0}px ${Number(textShadowY) || 0}px ${Number(textShadowBlur) || 0}px ${textShadowColor || '#000000'}`,
          whiteSpace: 'pre-wrap',
          overflowWrap: 'anywhere',
          wordBreak: 'break-word',
        }}
      >
        {text}
      </p>

      {hasSelectedNode && (
        <>
          {/* Handle de movimiento */}
          <div
            onMouseDown={onMoveMouseDown}
            title="Arrastra para mover"
            style={{
              position: 'absolute',
              left: 4,
              top: 4,
              width: 14,
              height: 14,
              borderRadius: 3,
              cursor: 'move',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.15)',
              background: 'rgba(0,0,0,0.15)',
            }}
          />
        </>
      )}
    </div>
  )
}

const TextSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <>
      <div className="d-grid gap-3">
          <div>
            <label className="form-label">Z-index</label>
            <input
              className="form-control form-control-sm"
              type="number"
              value={Number.isFinite(props.zIndex) ? props.zIndex : 0}
              onChange={(e) => setProp((p) => (p.zIndex = Number(e.target.value)))}
            />
          </div>
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
            <label className="form-label">Texto</label>
            <textarea
              className="form-control form-control-sm"
              rows={3}
              value={props.text ?? ''}
              onChange={(e) => setProp(p => p.text = e.target.value)}
              placeholder="Escribe el contenido..."
            />
          </div>
          <div>
            <label className="form-label">Color de texto</label>
            <input
              type="color"
              className="form-control form-control-color"
              value={props.textColor || '#000000'}
              onChange={(e) => setProp((p) => (p.textColor = e.target.value))}
            />
          </div>
          <div className="row g-2">
            <div className="col-4">
              <label className="form-label">Sombra X</label>
              <input
                className="form-control form-control-sm"
                type="number"
                value={Number.isFinite(props.textShadowX) ? props.textShadowX : 0}
                onChange={(e) => setProp((p) => (p.textShadowX = Number(e.target.value)))}
              />
            </div>
            <div className="col-4">
              <label className="form-label">Sombra Y</label>
              <input
                className="form-control form-control-sm"
                type="number"
                value={Number.isFinite(props.textShadowY) ? props.textShadowY : 0}
                onChange={(e) => setProp((p) => (p.textShadowY = Number(e.target.value)))}
              />
            </div>
            <div className="col-4">
              <label className="form-label">Blur</label>
              <input
                className="form-control form-control-sm"
                type="number"
                min={0}
                value={Number.isFinite(props.textShadowBlur) ? props.textShadowBlur : 0}
                onChange={(e) => setProp((p) => (p.textShadowBlur = Number(e.target.value)))}
              />
            </div>
          </div>
          <div>
            <label className="form-label">Color de la sombra</label>
            <input
              type="color"
              className="form-control form-control-color"
              value={props.textShadowColor || '#000000'}
              onChange={(e) => setProp((p) => (p.textShadowColor = e.target.value))}
            />
          </div>
          <div>
            <label className="form-label">Tipografía</label>
            <select
              className="form-select form-select-sm"
              value={props.fontClass ?? ''}
              onChange={(e) => setProp(p => p.fontClass = e.target.value)}
            >
              <option value="">Predeterminada del tema</option>
              <option value="font-amazonica">Amazonica</option>
              <option value="font-jungle-camp">Jungle Camp</option>
            </select>
          </div>
          <div>
            <label className="form-label">Tamaño de fuente</label>
            <input
              type="range"
              className="form-range"
              min={8}
              max={100}
              step={1}
              value={typeof props.fontSize === 'number' ? props.fontSize : 20}
              onChange={(e) => setProp(props => props.fontSize = Number(e.target.value))}
            />
            <div className="small text-muted">{props.fontSize ?? 20}px</div>
          </div>
        </div>
    </>
  )
}

Text.craft = {
  props: {
    text: "Texto de ejemplo",
    fontSize: 20,
    fontClass: '',
    translateX: 0,
    translateY: 0,
    zIndex: 0,
    opacity: 1,
    textColor: '#000000',
    textShadowX: 0,
    textShadowY: 0,
    textShadowBlur: 0,
    textShadowColor: '#000000'
  },
  rules:{
    canDrag: (node) => node.data.props.text !== "Drag",
  },
  related: {
    settings: TextSettings
  }
}