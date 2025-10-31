// filepath: c:\Users\Helowdas\Documents\GitHub\IHC-Proyect-1-\IHC-Proyect-1\src\components\user\BackgroundImageContainer.jsx
import { useNode } from '@craftjs/core';
import { useUploadImage } from '../../hooks/useUploadImage';

export const BackgroundImageContainer = ({ backgroundImage = 'https://placehold.co/1200x500', padding = 40, minHeight = 200, children }) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: `${padding}px`,
        minHeight: `${minHeight}px`,
      }}
    >
      {children}
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
        <label className="form-label">URL de la imagen de fondo</label>
        <input
          className="form-control form-control-sm"
          type="text"
          value={props.backgroundImage ?? ''}
          onChange={(e) => setProp((props) => (props.backgroundImage = e.target.value))}
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
            if (!file) return;
            const url = await upload(file);
            if (url) setProp((p) => (p.backgroundImage = url));
          }}
          disabled={isUploading}
        />
        {isUploading && <div className="text-info small mt-1">Subiendo imagen...</div>}
      </div>

      <div>
        <label className="form-label">Relleno (Padding)</label>
        <input
          type="range"
          className="form-range"
          min={0}
          max={100}
          step={1}
          value={props.padding ?? 40}
          onChange={(e) => setProp((props) => (props.padding = Number(e.target.value)))}
        />
        <div className="small text-muted">{props.padding ?? 40}px</div>
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
    </div>
  );
}

BackgroundImageContainer.craft = {
  props: {
    backgroundImage: '',
    padding: 40,
    minHeight: 200,
  },
  related: {
    settings: BackgroundImageContainerSettings,
  },
}; 