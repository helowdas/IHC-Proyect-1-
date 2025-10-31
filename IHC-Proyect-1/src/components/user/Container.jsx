// components/user/Container.jsx
import React from "react";
import { useNode } from "@craftjs/core";

export const Container = ({ 
  background, 
  padding = 0, 
  borderRadius = 0, 
  boxShadow = "", 
  // Positioning
  translateX = 0,
  translateY = 0,
  margin = 5,
  opacity = 1,
  // Layout props
  layout = 'flex', // 'flex' | 'grid'
  direction = 'column', // flex only
  justify = 'flex-start', // flex only
  align = 'flex-start', // flex or cross-axis
  wrap = 'nowrap', // flex only
  gap = 8,
  gridColumns = 2, // grid only
  gridJustifyItems = 'stretch', // grid only
  gridAlignItems = 'stretch', // grid only
  // Background options
  transparentBackground = false,
  children 
}) => {
  const { connectors: { connect, drag } } = useNode();
  const textAlign = align === 'center' ? 'center' : (align === 'flex-end' ? 'right' : 'left');

  const baseStyle = {
    margin: typeof margin === 'number' ? `${margin}px` : (margin || 0),
    background: transparentBackground ? 'transparent' : `${background}`,
    padding: `${Math.max(5, padding)}px`,
    borderRadius: `${borderRadius}px`,
    boxShadow: boxShadow ? `0 4px 8px ${boxShadow}` : "none",
    width: '100%',
    gap: typeof gap === 'number' ? `${gap}px` : gap,
    transform: `translate(${Number(translateX) || 0}px, ${Number(translateY) || 0}px)`,
    opacity: Math.max(0, Math.min(1, Number(opacity) || 0)),
  };

  const layoutStyle = (layout === 'grid')
    ? {
        display: 'grid',
        gridTemplateColumns: `repeat(${gridColumns || 1}, minmax(0, 1fr))`,
        justifyItems: gridJustifyItems,
        alignItems: gridAlignItems,
      }
    : {
        display: 'flex',
        flexDirection: direction,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap,
        textAlign,
      };

  return (
    <div
      ref={ref => connect(drag(ref))}
      style={{
        ...baseStyle,
        ...layoutStyle
      }}
    >
      {children}
    </div>
  )
}

// Nota: craft config unificada al final del archivo
export const ContainerSettings = () => {
  // Get current props and the setter from Craft.js
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));
  return (
    <>
      <div className="d-grid gap-3">
        <div>
          <label className="form-label">Opacidad</label>
          <input
            type="range"
            className="form-range"
            min={0}
            max={1}
            step={0.05}
            value={Number.isFinite(props.opacity) ? props.opacity : 1}
            onChange={(e) => setProp((p) => (p.opacity = Number(e.target.value)))}
          />
          <div className="small text-muted">{(props.opacity ?? 1).toFixed(2)}</div>
        </div>
        <div>
          <label className="form-label">Margen (px)</label>
          <input
            type="range"
            className="form-range"
            min={0}
            max={64}
            step={1}
            value={typeof props.margin === 'number' ? props.margin : 5}
            onChange={(e) => setProp((p) => (p.margin = Number(e.target.value)))}
          />
          <div className="small text-muted">{props.margin ?? 5}px</div>
        </div>
        <div className="row g-2">
          <div className="col-6">
            <label className="form-label">Mover X (px)</label>
            <input
              type="number"
              className="form-control form-control-sm"
              value={Number.isFinite(props.translateX) ? props.translateX : 0}
              onChange={(e) => setProp((p) => (p.translateX = Number(e.target.value)))}
            />
          </div>
          <div className="col-6">
            <label className="form-label">Mover Y (px)</label>
            <input
              type="number"
              className="form-control form-control-sm"
              value={Number.isFinite(props.translateY) ? props.translateY : 0}
              onChange={(e) => setProp((p) => (p.translateY = Number(e.target.value)))}
            />
          </div>
        </div>
        <div className="form-check">
          <input
            id="container-bg-transparent"
            type="checkbox"
            className="form-check-input"
            checked={!!props.transparentBackground}
            onChange={(e) => setProp((p) => (p.transparentBackground = e.target.checked))}
          />
          <label className="form-check-label" htmlFor="container-bg-transparent">
            Fondo transparente
          </label>
        </div>
        <div>
          <label className="form-label">Distribución</label>
          <select
            className="form-select form-select-sm"
            value={props.layout || 'flex'}
            onChange={(e) => setProp((p) => (p.layout = e.target.value))}
          >
            <option value="flex">Flex</option>
            <option value="grid">Grid</option>
          </select>
        </div>
        <div>
          <label className="form-label">Fondo</label>
          <input
            type="color"
            className="form-control form-control-color"
            value={props.background || '#ffffff'}
            onChange={(e) => setProp((props) => (props.background = e.target.value))}
            disabled={!!props.transparentBackground}
          />
        </div>

        <div>
          <label className="form-label">Padding</label>
          <input
            type="range"
            className="form-range"
            min={5}
            max={100}
            step={1}
            value={typeof props.padding === 'number' ? Math.max(5, props.padding) : 5}
            onChange={(e) => setProp((props) => (props.padding = Number(e.target.value)))}
          />
          <div className="small text-muted">{Math.max(5, props.padding ?? 5)}px</div>
        </div>
        {(props.layout || 'flex') === 'flex' && (
          <>
            <div>
              <label className="form-label">Dirección</label>
              <select
                className="form-select form-select-sm"
                value={props.direction || 'column'}
                onChange={(e) => setProp((p) => (p.direction = e.target.value))}
              >
                <option value="row">Fila</option>
                <option value="column">Columna</option>
              </select>
            </div>
            <div>
              <label className="form-label">Alineación (eje cruzado)</label>
              <select
                className="form-select form-select-sm"
                value={props.align || 'flex-start'}
                onChange={(e) => setProp((p) => (p.align = e.target.value))}
              >
                <option value="flex-start">Inicio</option>
                <option value="center">Centro</option>
                <option value="flex-end">Fin</option>
                <option value="stretch">Stretch</option>
              </select>
            </div>
            <div>
              <label className="form-label">Justificación (eje principal)</label>
              <select
                className="form-select form-select-sm"
                value={props.justify || 'flex-start'}
                onChange={(e) => setProp((p) => (p.justify = e.target.value))}
              >
                <option value="flex-start">Inicio</option>
                <option value="center">Centro</option>
                <option value="flex-end">Fin</option>
                <option value="space-between">Espacio entre</option>
                <option value="space-around">Espacio alrededor</option>
                <option value="space-evenly">Espacio uniforme</option>
              </select>
            </div>
            <div>
              <label className="form-label">Wrap</label>
              <select
                className="form-select form-select-sm"
                value={props.wrap || 'nowrap'}
                onChange={(e) => setProp((p) => (p.wrap = e.target.value))}
              >
                <option value="nowrap">No wrap</option>
                <option value="wrap">Wrap</option>
                <option value="wrap-reverse">Wrap reverse</option>
              </select>
            </div>
          </>
        )}

        {(props.layout || 'flex') === 'grid' && (
          <>
            <div>
              <label className="form-label">Columnas</label>
              <input
                type="range"
                className="form-range"
                min={1}
                max={6}
                step={1}
                value={typeof props.gridColumns === 'number' ? props.gridColumns : 2}
                onChange={(e) => setProp((p) => (p.gridColumns = Number(e.target.value)))}
              />
              <div className="small text-muted">{props.gridColumns ?? 2} columnas</div>
            </div>
            <div>
              <label className="form-label">Alineación horizontal (celdas)</label>
              <select
                className="form-select form-select-sm"
                value={props.gridJustifyItems || 'stretch'}
                onChange={(e) => setProp((p) => (p.gridJustifyItems = e.target.value))}
              >
                <option value="start">Inicio</option>
                <option value="center">Centro</option>
                <option value="end">Fin</option>
                <option value="stretch">Stretch</option>
              </select>
            </div>
            <div>
              <label className="form-label">Alineación vertical (celdas)</label>
              <select
                className="form-select form-select-sm"
                value={props.gridAlignItems || 'stretch'}
                onChange={(e) => setProp((p) => (p.gridAlignItems = e.target.value))}
              >
                <option value="start">Inicio</option>
                <option value="center">Centro</option>
                <option value="end">Fin</option>
                <option value="stretch">Stretch</option>
              </select>
            </div>
          </>
        )}

        <div>
          <label className="form-label">Espacio entre elementos (gap)</label>
          <input
            type="range"
            className="form-range"
            min={0}
            max={48}
            step={1}
            value={typeof props.gap === 'number' ? props.gap : 8}
            onChange={(e) => setProp((p) => (p.gap = Number(e.target.value)))}
          />
          <div className="small text-muted">{props.gap ?? 8}px</div>
        </div>

        <div>
          <label className="form-label">Border Radius</label>
          <input
            type="range"
            className="form-range"
            min={0}
            max={100}
            step={1}
            value={typeof props.borderRadius === 'number' ? props.borderRadius : 0}
            onChange={(e) => setProp((props) => (props.borderRadius = Number(e.target.value)))}
          />
          <div className="small text-muted">{props.borderRadius ?? 0}px</div>
        </div>

        <div>
          <label className="form-label">Box Shadow</label>
          <input
            type="color"
            className="form-control form-control-color"
            value={props.boxShadow || '#000000'}
            onChange={(e) => setProp((props) => (props.boxShadow = e.target.value))}
            style={{ width: 40, height: 40, padding: 0, border: 'none', background: 'transparent' }}
          />
        </div>
          
      </div>
    </>
  )
}

export const ContainerDefaultProps = {
  background: "#adb5bd",
  padding: 5,
  borderRadius: 0,
  boxShadow: "",
  translateX: 0,
  translateY: 0,
  margin: 5,
  opacity: 1,
  layout: 'flex',
  direction: 'column',
  justify: 'flex-start',
  align: 'flex-start',
  wrap: 'nowrap',
  gap: 8,
  gridColumns: 2,
  gridJustifyItems: 'stretch',
  gridAlignItems: 'stretch',
  transparentBackground: false
};

Container.craft = {
  props: ContainerDefaultProps,
  related: {
    settings: ContainerSettings
  }
}