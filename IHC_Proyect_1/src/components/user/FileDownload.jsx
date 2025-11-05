import React from 'react';
import { useNode, useEditor } from '@craftjs/core';
import { useUploadImage } from '../../hooks/useUploadImage';
import IconPicker from '../ui/IconPicker';

/**
 * FileDownload
 * - Permite subir un archivo a un bucket de Supabase (por defecto "Assets").
 * - Muestra un botón/enlace que, al hacer clic en el sitio exportado, abre/descarga el archivo.
 */
export const FileDownload = ({
  text = 'Descargar archivo',
  fileUrl = '',
  suggestedName = '',
  // Estilo como en Button
  variant = 'contained', // 'text' | 'outlined' | 'contained'
  color = 'primary', // token bootstrap
  buttonTextColor = '',
  buttonBgColor = '',
  buttonBorderColor = '',
  size = 'medium', // small|medium|large
  iconName = 'download', // bootstrap icon name
  // posicionamiento
  translateX = 0,
  translateY = 0,
  zIndex = 0,
  opacity = 1,
}) => {
  const {
    id,
    connectors: { connect, drag },
    selected,
  } = useNode((node) => ({ selected: node.events.selected }));
  const { actions: { add, selectNode }, query: { createNode, node } } = useEditor();

  // Estilos similares al Button
  const colorToken = (color || 'primary').toLowerCase();
  const isOutline = variant === 'outlined';
  const isLink = variant === 'text';
  const hasCustomColors = !!(buttonTextColor || buttonBgColor || buttonBorderColor);
  const base = hasCustomColors
    ? 'btn'
    : (isLink ? 'btn btn-link' : `btn ${isOutline ? 'btn-outline-' : 'btn-'}${colorToken}`);
  const sizeCls = size === 'large' ? 'btn-lg' : size === 'small' ? 'btn-sm' : '';
  const classes = [base, sizeCls].filter(Boolean).join(' ');

  const style = {
    transform: `translate(${Number(translateX) || 0}px, ${Number(translateY) || 0}px)`,
    opacity: Math.max(0, Math.min(1, Number(opacity) || 1)),
    position: 'relative',
    zIndex: Number(zIndex) || 0,
  };

  if (hasCustomColors) {
    if (isLink) {
      style.backgroundColor = 'transparent';
      if (buttonTextColor) style.color = buttonTextColor;
      style.border = 'none';
    } else if (isOutline) {
      style.backgroundColor = 'transparent';
      if (buttonTextColor) style.color = buttonTextColor;
      style.borderStyle = 'solid';
      style.borderWidth = 1;
      if (buttonBorderColor) style.borderColor = buttonBorderColor;
      else if (buttonTextColor) style.borderColor = buttonTextColor;
    } else {
      if (buttonBgColor) style.backgroundColor = buttonBgColor;
      if (buttonTextColor) style.color = buttonTextColor;
      style.borderStyle = 'solid';
      style.borderWidth = 1;
      if (buttonBorderColor) style.borderColor = buttonBorderColor;
      else if (buttonBgColor) style.borderColor = buttonBgColor;
    }
  }

  // Si hay fileUrl, renderizamos <a> para soportar atributo download
  const content = (
    <>
      {iconName && <i className={`bi bi-${iconName} me-1`} aria-hidden="true" />}
      <span>{text}</span>
    </>
  );

  return (
    <div ref={(ref) => connect(drag(ref))}>
      {fileUrl ? (
        <a
          href={fileUrl}
          className={classes}
          style={style}
          target="_blank"
          rel="noopener noreferrer"
          download={suggestedName || true}
        >
          {content}
        </a>
      ) : (
        <button type="button" className={classes} style={style} disabled>
          {content}
        </button>
      )}

      {selected && (
        <span
          role="button"
          aria-label="Duplicar"
          className="position-absolute"
          style={{
            top: -14,
            right: -14,
            width: 28,
            height: 28,
            borderRadius: '50%',
            backgroundColor: '#590004',
            color: '#fff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 8px #590004, 0 0 12px #590004',
            cursor: 'pointer',
            zIndex: 9999,
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const current = node(id).get();
            const { type, props, parent } = {
              type: current.data.type,
              props: current.data.props,
              parent: current.data.parent,
            };
            const parentNode = node(parent).get();
            const siblings = parentNode.data.nodes || [];
            const index = Math.max(0, siblings.indexOf(id));
            const shiftedProps = {
              ...props,
              translateX: (Number(props.translateX) || 0) + 10,
              translateY: (Number(props.translateY) || 0) + 10,
            };
            const newNode = createNode(React.createElement(type, shiftedProps));
            add(newNode, parent, index + 1);
            selectNode(newNode.id);
          }}
        >
          <i className="bi bi-copy" />
        </span>
      )}
    </div>
  );
};

export const FileDownloadSettings = () => {
  const { actions: { setProp }, props } = useNode((node) => ({ props: node.data.props }));
  const { upload, isUploading, error } = useUploadImage('Assets');

  return (
    <div className="d-grid gap-3">
      {/* Icono */}
      <IconPicker
        label="Icono"
        selectedIcon={props.iconName}
        onSelect={(iconName) => setProp((p) => (p.iconName = iconName))}
      />

      <div>
        <label className="form-label">Texto del botón</label>
        <input
          type="text"
          className="form-control form-control-sm"
          value={props.text || ''}
          onChange={(e) => setProp((p) => (p.text = e.target.value))}
          placeholder="Descargar archivo"
        />
      </div>

      <div className="row g-2">
        <div className="col-6">
          <label className="form-label">Variante</label>
          <select
            className="form-select form-select-sm"
            value={props.variant || 'contained'}
            onChange={(e) => setProp((p) => (p.variant = e.target.value))}
          >
            <option value="text">Texto</option>
            <option value="outlined">Con borde</option>
            <option value="contained">Relleno</option>
          </select>
        </div>
        <div className="col-6">
          <label className="form-label">Tamaño</label>
          <select
            className="form-select form-select-sm"
            value={props.size || 'medium'}
            onChange={(e) => setProp((p) => (p.size = e.target.value))}
          >
            <option value="small">Pequeño</option>
            <option value="medium">Mediano</option>
            <option value="large">Grande</option>
          </select>
        </div>
      </div>

      {/* Color (token) y colores personalizados como en Button */}
      <div>
        <label className="form-label">Color</label>
        <select
          className="form-select form-select-sm"
          value={props.color || 'primary'}
          onChange={(e) => setProp((p) => (p.color = e.target.value))}
        >
          <option value="primary">Principal</option>
          <option value="secondary">Secundario</option>
          <option value="success">Éxito</option>
          <option value="danger">Peligro</option>
          <option value="warning">Advertencia</option>
          <option value="info">Información</option>
          <option value="light">Claro</option>
          <option value="dark">Oscuro</option>
        </select>
      </div>
      <div className="row g-2">
        <div className="col-4">
          <label className="form-label">Color texto</label>
          <input
            type="color"
            className="form-control form-control-color"
            value={props.buttonTextColor || ''}
            onChange={(e) => setProp((p) => (p.buttonTextColor = e.target.value))}
          />
        </div>
        <div className="col-4">
          <label className="form-label">Color fondo</label>
          <input
            type="color"
            className="form-control form-control-color"
            value={props.buttonBgColor || ''}
            onChange={(e) => setProp((p) => (p.buttonBgColor = e.target.value))}
          />
        </div>
        <div className="col-4">
          <label className="form-label">Color borde</label>
          <input
            type="color"
            className="form-control form-control-color"
            value={props.buttonBorderColor || ''}
            onChange={(e) => setProp((p) => (p.buttonBorderColor = e.target.value))}
          />
        </div>
      </div>

      <div>
        <label className="form-label">URL del archivo</label>
        <input
          type="text"
          className="form-control form-control-sm"
          value={props.fileUrl || ''}
          onChange={(e) => setProp((p) => (p.fileUrl = e.target.value))}
          placeholder="https://..."
        />
        <small className="text-muted">Puedes subir un archivo o pegar una URL pública.</small>
      </div>

      <div>
        <label className="form-label">Subir archivo</label>
        <input
          className="form-control form-control-sm"
          type="file"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const url = await upload(file);
            if (url) {
              setProp((p) => {
                p.fileUrl = url;
                p.suggestedName = file.name || '';
              });
            }
          }}
          disabled={isUploading}
        />
        {isUploading && <div className="text-info small mt-1">Subiendo archivo…</div>}
        {error && <div className="text-danger small mt-1">{String(error)}</div>}
      </div>

      <div>
        <label className="form-label">Nombre sugerido</label>
        <input
          type="text"
          className="form-control form-control-sm"
          value={props.suggestedName || ''}
          onChange={(e) => setProp((p) => (p.suggestedName = e.target.value))}
          placeholder="archivo.pdf"
        />
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
    </div>
  );
};

FileDownload.craft = {
  props: {
    text: 'Descargar archivo',
    fileUrl: '',
    suggestedName: '',
    variant: 'contained',
    color: 'primary',
    buttonTextColor: '',
    buttonBgColor: '',
    buttonBorderColor: '',
    size: 'medium',
    iconName: 'download',
    translateX: 0,
    translateY: 0,
    zIndex: 0,
    opacity: 1,
  },
  related: {
    settings: FileDownloadSettings,
  },
};
