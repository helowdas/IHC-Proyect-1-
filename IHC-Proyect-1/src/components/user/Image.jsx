
import { useNode } from '@craftjs/core';
import { uploadImage } from '../../../SupabaseCredentials';
import { useState } from 'react';
import {useUploadImage} from '../../hooks/useUploadImage';

var handleFileChange;
var uploading = false;

export const Image = ({ src = 'https://placehold.co/1200x500', alt = 'Imagen', width = 100, fit = 'cover' , }) => {

  const { connectors: { connect, drag }, actions: {setProp} } = useNode((node) => ({
    props: node.data.props,
  }));


  return (
    <div ref={(ref) => connect(drag(ref))}>
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
      </div>
    </>
  )
}

Image.craft = {
  props: { src: 'https://placehold.co/1200x500', alt: 'Imagen', width: 100, fit: 'cover' },
  related:{
    settings: ImageSettings
  }
};
