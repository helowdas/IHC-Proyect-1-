import React from 'react';
import { useNode } from '@craftjs/core';
import IconPicker from '../ui/IconPicker';

export const IconButton = ({
  iconName = 'star',
  iconSize = 20,
  iconColor = '#000000',
  backgroundColor = '',
  borderColor = '',
  borderWidth = 0,
  borderRadius = 0,
  padding = 10,
  actionType = 'none',
  to = '',
  sectionName = '',
  externalUrl = '',
  externalNewTab = true,
  translateX = 0,
  translateY = 0,
  zIndex = 0,
  opacity = 1
}) => {
  const {
    connectors: { connect, drag },
    selected
  } = useNode((node) => ({
    selected: node.events.selected
  }));

  const handleClick = (e) => {
    e.stopPropagation();
    
    if (actionType === 'route' && to) {
      window.location.href = to;
    } else if (actionType === 'section' && sectionName) {
      window.location.href = `/editor?section=${sectionName}`;
    } else if (actionType === 'external' && externalUrl) {
      if (externalNewTab) {
        window.open(externalUrl, '_blank');
      } else {
        window.location.href = externalUrl;
      }
    }
  };

  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${padding}px`,
    backgroundColor: backgroundColor || 'transparent',
    border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor || 'transparent'}` : 'none',
    borderRadius: `${borderRadius}px`,
    cursor: actionType !== 'none' ? 'pointer' : 'default',
    transform: `translate(${Number(translateX) || 0}px, ${Number(translateY) || 0}px)`,
    opacity: Math.max(0, Math.min(1, Number(opacity) || 1)),
    position: 'relative',
    zIndex: Number(zIndex) || 0
  };

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      style={style}
      onClick={handleClick}
    >
      <i 
        className={`bi bi-${iconName}`}
        style={{
          fontSize: `${iconSize}px`,
          color: iconColor
        }}
      ></i>

      {selected && null}
    </div>
  );
};

const IconButtonSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props
  }));

  return (
    <div className="d-grid gap-3">
      {/* Selector de icono */}
      <IconPicker
        label="Icono"
        selectedIcon={props.iconName}
        onSelect={(iconName) => setProp((p) => (p.iconName = iconName))}
      />

      {/* Tamaño del icono */}
      <div>
        <label className="form-label">Tamaño del icono (px)</label>
        <input
          className="form-control form-control-sm"
          type="number"
          min="10"
          max="200"
          value={props.iconSize || 20}
          onChange={(e) => setProp((p) => (p.iconSize = parseInt(e.target.value) || 20))}
        />
      </div>

      {/* Colores */}
      <div className="row g-2">
        <div className="col-6">
          <label className="form-label">Color icono</label>
          <input
            type="color"
            className="form-control form-control-color"
            value={props.iconColor || '#000000'}
            onChange={(e) => setProp((p) => (p.iconColor = e.target.value))}
          />
        </div>
        <div className="col-6">
          <label className="form-label">Fondo</label>
          <input
            type="color"
            className="form-control form-control-color"
            value={props.backgroundColor || ''}
            onChange={(e) => setProp((p) => (p.backgroundColor = e.target.value))}
          />
        </div>
      </div>

      {/* Bordes */}
      <div>
        <label className="form-label">Ancho borde (px)</label>
        <input
          className="form-control form-control-sm"
          type="number"
          min="0"
          max="10"
          value={props.borderWidth || 0}
          onChange={(e) => setProp((p) => (p.borderWidth = parseInt(e.target.value) || 0))}
        />
      </div>

      {props.borderWidth > 0 && (
        <div>
          <label className="form-label">Color borde</label>
          <input
            type="color"
            className="form-control form-control-color"
            value={props.borderColor || '#000000'}
            onChange={(e) => setProp((p) => (p.borderColor = e.target.value))}
          />
        </div>
      )}

      {/* Radio de borde */}
      <div>
        <label className="form-label">Radio de borde (px)</label>
        <input
          className="form-control form-control-sm"
          type="number"
          min="0"
          max="50"
          value={props.borderRadius || 0}
          onChange={(e) => setProp((p) => (p.borderRadius = parseInt(e.target.value) || 0))}
        />
      </div>

      {/* Padding */}
      <div>
        <label className="form-label">Padding (px)</label>
        <input
          className="form-control form-control-sm"
          type="number"
          min="0"
          max="50"
          value={props.padding || 10}
          onChange={(e) => setProp((p) => (p.padding = parseInt(e.target.value) || 10))}
        />
      </div>

      {/* Posicionamiento */}
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

      {/* Z-index */}
      <div>
        <label className="form-label">Z-index</label>
        <input
          className="form-control form-control-sm"
          type="number"
          value={Number.isFinite(props.zIndex) ? props.zIndex : 0}
          onChange={(e) => setProp((p) => (p.zIndex = Number(e.target.value)))}
        />
      </div>

      {/* Opacidad */}
      <div>
        <label className="form-label">Opacidad (0-1)</label>
        <input
          className="form-control form-control-sm"
          type="number"
          min="0"
          max="1"
          step="0.1"
          value={Number.isFinite(props.opacity) ? props.opacity : 1}
          onChange={(e) => setProp((p) => (p.opacity = Math.max(0, Math.min(1, Number(e.target.value)))))}
        />
      </div>

      {/* Tipo de acción */}
      <div>
        <label className="form-label">Tipo de acción</label>
        <select
          className="form-select form-select-sm"
          value={props.actionType || 'none'}
          onChange={(e) => setProp((p) => (p.actionType = e.target.value))}
        >
          <option value="none">Ninguna</option>
          <option value="route">Ruta interna</option>
          <option value="section">Sección</option>
          <option value="external">URL externa</option>
        </select>
      </div>

      {/* Configuración de acción */}
      {props.actionType === 'route' && (
        <div>
          <label className="form-label">Ruta</label>
          <input
            className="form-control form-control-sm"
            type="text"
            value={props.to || ''}
            onChange={(e) => setProp((p) => (p.to = e.target.value))}
            placeholder="/ruta"
          />
        </div>
      )}

      {props.actionType === 'section' && (
        <div>
          <label className="form-label">Nombre de sección</label>
          <input
            className="form-control form-control-sm"
            type="text"
            value={props.sectionName || ''}
            onChange={(e) => setProp((p) => (p.sectionName = e.target.value))}
            placeholder="nombre-seccion"
          />
        </div>
      )}

      {props.actionType === 'external' && (
        <div>
          <label className="form-label">URL externa</label>
          <input
            className="form-control form-control-sm"
            type="text"
            value={props.externalUrl || ''}
            onChange={(e) => setProp((p) => (p.externalUrl = e.target.value))}
            placeholder="https://..."
          />
          <div className="form-check mt-2">
            <input
              className="form-check-input"
              type="checkbox"
              checked={props.externalNewTab !== false}
              onChange={(e) => setProp((p) => (p.externalNewTab = e.target.checked))}
            />
            <label className="form-check-label">
              Abrir en nueva pestaña
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

IconButton.craft = {
  props: {
    iconName: 'star',
    iconSize: 20,
    iconColor: '#000000',
    backgroundColor: '',
    borderColor: '',
    borderWidth: 0,
    borderRadius: 0,
    padding: 10,
    actionType: 'none',
    to: '',
    sectionName: '',
    externalUrl: '',
    externalNewTab: true,
    translateX: 0,
    translateY: 0,
    zIndex: 0,
    opacity: 1
  },
  related: {
    settings: IconButtonSettings
  }
};

