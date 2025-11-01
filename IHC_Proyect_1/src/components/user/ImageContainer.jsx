// filepath: c:\Users\Helowdas\Documents\GitHub\IHC-Proyect-1-\IHC-Proyect-1\src\components\user\BackgroundImageContainer.jsx
import { useEditor, useNode } from '@craftjs/core';
import { useUploadImage } from '../../hooks/useUploadImage';
import React from 'react';

export const BackgroundImageContainer = ({
  backgroundImage = 'https://placehold.co/1200x500',
  padding = 40,
  minHeight = 200,
  // Positioning
  translateX = 0,
  translateY = 0,
  zIndex = 0,
  margin = 5,
  opacity = 1,
  // Layout props (mismas que Container)
  layout = 'flex',
  direction = 'column',
  justify = 'flex-start',
  align = 'flex-start',
  wrap = 'nowrap',
  gap = 8,
  gridColumns = 2,
  gridJustifyItems = 'stretch',
  gridAlignItems = 'stretch',
  // Fondo transparente
  transparentBackground = false,
  children,
}) => {
  const { connectors: { connect, drag }, actions: { setProp }, selected } = useNode((node) => ({
    selected: node.events.selected,
  }));
  const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));

  const textAlign = align === 'center' ? 'center' : (align === 'flex-end' ? 'right' : 'left');

  // Eliminado: manejo de movimiento por arrastre del mouse

  const baseStyle = {
    width: '100%',
    position: 'relative',
    padding: `${Math.max(5, padding)}px`,
    minHeight: `${minHeight}px`,
    backgroundImage: transparentBackground ? 'none' : `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    gap: typeof gap === 'number' ? `${gap}px` : gap,
    transform: `translate(${Number(translateX) || 0}px, ${Number(translateY) || 0}px)`,
    margin: typeof margin === 'number' ? `${margin}px` : (margin || 0),
    opacity: Math.max(0, Math.min(1, Number(opacity) || 0)),
    zIndex: Number(zIndex) || 0,
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
      ref={(ref) => connect(drag(ref))}
      style={{
        ...baseStyle,
        ...layoutStyle,
      }}
    >
      {enabled && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {/* Borde superior */}
          <div
            ref={(ref) => ref && connect(drag(ref))}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 10, cursor: 'pointer', pointerEvents: 'auto' }}
            aria-label="Seleccionar contenedor (borde superior)"
          />
          {/* Borde inferior */}
          <div
            ref={(ref) => ref && connect(drag(ref))}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 10, cursor: 'pointer', pointerEvents: 'auto' }}
            aria-label="Seleccionar contenedor (borde inferior)"
          />
          {/* Borde izquierdo */}
          <div
            ref={(ref) => ref && connect(drag(ref))}
            style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 10, cursor: 'pointer', pointerEvents: 'auto' }}
            aria-label="Seleccionar contenedor (borde izquierdo)"
          />
          {/* Borde derecho */}
          <div
            ref={(ref) => ref && connect(drag(ref))}
            style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 10, cursor: 'pointer', pointerEvents: 'auto' }}
            aria-label="Seleccionar contenedor (borde derecho)"
          />
        </div>
      )}

      {children}

      {selected && null}
    </div>
  );
};

export function BackgroundImageContainerSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  const { upload, isUploading } = useUploadImage("Assets");

  return (
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
        <label className="form-label">Z-index</label>
        <input
          type="number"
          className="form-control form-control-sm"
          value={Number.isFinite(props.zIndex) ? props.zIndex : 0}
          onChange={(e) => setProp((p) => (p.zIndex = Number(e.target.value)))}
        />
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
          id="bgimg-transparent"
          type="checkbox"
          className="form-check-input"
          checked={!!props.transparentBackground}
          onChange={(e) => setProp((p) => (p.transparentBackground = e.target.checked))}
        />
        <label className="form-check-label" htmlFor="bgimg-transparent">
          Fondo transparente
        </label>
      </div>

      <div>
        <label className="form-label">URL de la imagen de fondo</label>
        <input
          className="form-control form-control-sm"
          type="text"
          value={props.backgroundImage ?? ''}
          onChange={(e) => setProp((props) => (props.backgroundImage = e.target.value))}
          placeholder="https://..."
          disabled={!!props.transparentBackground}
        />
      </div>

      <div>
        <input
          className="form-control form-control-sm"
          type="file"
          accept='image/*'
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const url = await upload(file);
            if (url) setProp((p) => (p.backgroundImage = url));
          }}
          disabled={isUploading || !!props.transparentBackground}
        />
        {isUploading && <div className="text-info small mt-1">Subiendo imagen...</div>}
      </div>

      <div>
        <label className="form-label">Relleno (Padding)</label>
        <input
          type="range"
          className="form-range"
          min={5}
          max={100}
          step={1}
          value={props.padding != null ? Math.max(5, props.padding) : 40}
          onChange={(e) => setProp((props) => (props.padding = Number(e.target.value)))}
        />
        <div className="small text-muted">{Math.max(5, props.padding ?? 40)}px</div>
      </div>

      <div>
        <label className="form-label">Altura Mínima</label>
        <input
          type="range"
          className="form-range"
          min={50}
          max={500}
          step={10}
          value={props.minHeight ?? 200}
          onChange={(e) => setProp((props) => (props.minHeight = Number(e.target.value)))}
        />
        <div className="small text-muted">{props.minHeight ?? 200}px</div>
      </div>

      {/* Controles de layout (igual que Container) */}
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
    </div>
  );
}

BackgroundImageContainer.craft = {
  props: {
    backgroundImage: '',
    padding: 40,
    minHeight: 200,
    translateX: 0,
    translateY: 0,
    zIndex: 0,
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
    transparentBackground: false,
  },
  related: {
    settings: BackgroundImageContainerSettings,
  },
};