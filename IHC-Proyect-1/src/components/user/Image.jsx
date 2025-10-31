
import { useNode } from '@craftjs/core';
import { uploadImage } from '../../../SupabaseCredentials';
import { useState } from 'react';
import {useUploadImage} from '../../hooks/useUploadImage';
import { useNavigate } from 'react-router-dom';

var handleFileChange;
var uploading = false;

export const Image = ({
  src = 'https://placehold.co/1200x500',
  alt = 'Imagen',
  width = 100,
  fit = 'cover',
  translateX = 0,
  translateY = 0,
  zIndex = 0,
  opacity = 1,
  // Click behavior like Button
  actionType = 'route', // 'route' | 'section' | 'external'
  to = '', // internal route or #anchor
  sectionName = '', // for section navigation
  externalUrl = '', // for external link
  externalNewTab = true,
}) => {

  const { connectors: { connect, drag }, actions: {setProp} } = useNode((node) => ({
    props: node.data.props,
  }));
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (actionType === 'section') {
      const target = sectionName ? `/editor?section=${encodeURIComponent(sectionName)}` : '';
      if (!target) return;
      if (target.startsWith('#')) {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      navigate(target);
      return;
    }
    if (actionType === 'external') {
      const url = (externalUrl || '').trim();
      if (!url) return;
      if (typeof window !== 'undefined') {
        window.open(url, externalNewTab ? '_blank' : '_self');
      }
      return;
    }
    const route = (to || '').trim();
    if (route) {
      if (route.startsWith('#')) {
        const el = document.querySelector(route);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      navigate(route);
    }
  };


  const actionable = (
    (actionType === 'route' && (to || '').trim()) ||
    (actionType === 'section' && (sectionName || '').trim()) ||
    (actionType === 'external' && (externalUrl || '').trim())
  );

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      style={{
        transform: `translate(${Number(translateX) || 0}px, ${Number(translateY) || 0}px)`,
        opacity: Math.max(0, Math.min(1, Number(opacity) || 0)),
        position: 'relative',
        zIndex: Number(zIndex) || 0,
        cursor: actionable ? 'pointer' : 'default',
      }}
      onClick={handleClick}
    >
      <img
        src={src}
        alt={alt}
        style={{ display: 'block', width: `${width}%`, height: 'auto', objectFit: fit, borderRadius: 4 }}
      />
    </div>
  );
};

export function ImageSettings() {
  // Obtener props actuales y setProp desde Craft
  const { actions: { setProp }, props } = useNode((node) => ({
    props: node.data.props,
  }));

  const {upload, isUploading, error} = useUploadImage("Assets");

  return(
    <>
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
        <div>
          <label className="form-label">Z-index</label>
          <input
            className="form-control form-control-sm"
            type="number"
            value={Number.isFinite(props.zIndex) ? props.zIndex : 0}
            onChange={(e) => setProp((p) => (p.zIndex = Number(e.target.value)))}
          />
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
          <label className="form-label">URL de la imagen</label>
          <input
            className="form-control form-control-sm"
            type="text"
            value={props.src ?? ''}
            onChange={(e) => setProp((props) => (props.src = e.target.value))}
            placeholder="https://..."
          />
        </div>

        <div>
          <input
            className="form-control form-control-sm"
            type="file"
            accept='image/*'
            onChange={async (e) => {
              const file = e.target.files?.[0];
              const url = await upload(file);
              if (url) setProp((p) => (p.src = url));
            }}
            disabled={isUploading}
          />
          {isUploading && <div className="text-info small mt-1">Subiendo imagen...</div>}
        </div>

        <div>
          <label className="form-label">Texto alternativo</label>
          <input
            className="form-control form-control-sm"
            type="text"
            value={props.alt ?? ''}
            onChange={(e) => setProp((props) => (props.alt = e.target.value))}
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
            onChange={(e) => setProp((props) => (props.width = Number(e.target.value)))}
          />
          <div className="small text-muted">{props.width ?? 100}%</div>
        </div>
        <div>
          <label className="form-label">Ajuste</label>
          <select
            className="form-select form-select-sm"
            value={props.fit || 'cover'}
            onChange={(e) => setProp((props) => (props.fit = e.target.value))}
          >
            <option value="contain">contain</option>
            <option value="cover">cover</option>
            <option value="fill">fill</option>
            <option value="none">none</option>
            <option value="scale-down">scale-down</option>
          </select>
        </div>
        <hr />
        <div>
          <label className="form-label">Acción al hacer clic</label>
          <select
            className="form-select form-select-sm"
            value={props.actionType || 'route'}
            onChange={(e) => setProp((p) => (p.actionType = e.target.value))}
          >
            <option value="section">Ir a sección</option>
            <option value="external">Enlace externo</option>
          </select>
        </div>
        { (props.actionType || 'route') === 'section' && (
          <div>
            <label className="form-label">Nombre de sección</label>
            <input
              className="form-control form-control-sm"
              type="text"
              value={props.sectionName ?? ''}
              onChange={(e) => setProp((p) => (p.sectionName = e.target.value))}
              placeholder="Landing, Home, ..."
            />
          </div>
        )}
        { (props.actionType || 'route') === 'external' && (
          <div className="row g-2">
            <div className="col-8">
              <label className="form-label">URL externa</label>
              <input
                className="form-control form-control-sm"
                type="text"
                value={props.externalUrl ?? ''}
                onChange={(e) => setProp((p) => (p.externalUrl = e.target.value))}
                placeholder="https://..."
              />
            </div>
            <div className="col-4 d-flex align-items-end">
              <div className="form-check">
                <input
                  id="img-ext-newtab"
                  className="form-check-input"
                  type="checkbox"
                  checked={!!props.externalNewTab}
                  onChange={(e) => setProp((p) => (p.externalNewTab = e.target.checked))}
                />
                <label className="form-check-label" htmlFor="img-ext-newtab">Nueva pestaña</label>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

Image.craft = {
  props: {
    src: 'https://placehold.co/1200x500',
    alt: 'Imagen',
    width: 100,
    fit: 'cover',
    translateX: 0,
    translateY: 0,
    zIndex: 0,
    opacity: 1,
    actionType: 'route',
    to: '',
    sectionName: '',
    externalUrl: '',
    externalNewTab: true,
  },
  related:{
    settings: ImageSettings
  }
};
