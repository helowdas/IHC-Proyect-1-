// components/user/Text.js
import React, { useEffect, useState} from "react";
import { useNode } from "@craftjs/core";

export const Text = ({ text, fontSize, fontClass, translateX = 0, translateY = 0 }) => {
  const { connectors: { connect, drag },hasSelectedNode, hasDraggedNode, actions: { setProp } } = useNode((state) => ({
    hasSelectedNode: state.events.selected,
    hasDraggedNode: state.events.dragged
  }));

  const [editable, setEditable] = useState(false);

  useEffect(() => {!hasSelectedNode && setEditable(false)},[hasSelectedNode])

  return (
    <div 
      ref={ref => connect(drag(ref))}
      onClick={() => setEditable(true)}
      style={{ transform: `translate(${Number(translateX) || 0}px, ${Number(translateY) || 0}px)` }}
    >
      <p
        className={fontClass || undefined}
        style={{
          fontSize,
          whiteSpace: 'pre-wrap',      // respeta saltos de línea del textarea
          overflowWrap: 'anywhere',    // rompe palabras/largas sin espacios
          wordBreak: 'break-word',     // fallback para navegadores más viejos
        }}
      >
        {text}
      </p>
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
              max={64}
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
    translateY: 0
  },
  rules:{
    canDrag: (node) => node.data.props.text !== "Drag",
  },
  related: {
    settings: TextSettings
  }
}