import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Editor, Frame, Element, useEditor } from '@craftjs/core';
import { HashRouter, Routes, Route, Navigate, useParams, useSearchParams, useLocation } from 'react-router-dom';

// Importa los mismos componentes que usas en el editor principal
import { Container } from './components/user/Container';
import { Button } from './components/user/Button';
import { Card, CardTop, CardBottom } from './components/user/Card';
import { Text } from './components/user/Text';
import { Image } from './components/user/Image';
import { BackgroundImageContainer } from './components/user/ImageContainer';
import { ChevronButton } from './components/user/ChevronButton';
import { IconButton } from './components/user/IconButton';

// Estilos necesarios para que el sitio exportado luzca igual
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import './index.css';

const resolver = {
  Card,
  Button,
  Text,
  Image,
  Container,
  CardTop,
  CardBottom,
  BackgroundImageContainer,
  ChevronButton,
  IconButton,
};

// Prefetch util: extrae URLs de imágenes desde un objeto/JSON cualquiera
function collectImageUrls(obj, out = new Set()) {
  if (!obj || typeof obj !== 'object') return out;
  const visit = (v) => {
    if (!v) return;
    const t = typeof v;
    if (t === 'string') {
      const s = v.trim();
      // background: url("...")
      const urlInCss = s.match(/url\((['\"]?)([^)\"']+)\1\)/i);
      if (urlInCss && urlInCss[2]) {
        const u = urlInCss[2];
        if (/^https?:\/\//i.test(u)) out.add(u);
        return;
      }
      // direct URLs
      if (/^https?:\/\//i.test(s) && /(\.(png|jpe?g|gif|webp|svg))(\?|#|$)/i.test(s)) {
        out.add(s);
      }
      return;
    }
    if (Array.isArray(v)) {
      v.forEach(visit);
      return;
    }
    if (t === 'object') {
      for (const k in v) visit(v[k]);
    }
  };
  visit(obj);
  return out;
}

function prefetchImagesFromRoutes(routes) {
  try {
    const urls = new Set();
    for (const key of Object.keys(routes || {})) {
      const raw = routes[key];
      let parsed = raw;
      if (typeof raw === 'string') {
        try { parsed = JSON.parse(raw); } catch { parsed = null; }
      }
      if (parsed) collectImageUrls(parsed, urls);
    }
    urls.forEach((src) => {
      try { const img = new Image(); img.decoding = 'async'; img.src = src; } catch {}
    });
    // eslint-disable-next-line no-console
    console.log('[Export Viewer] Prefetched images:', urls.size);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Prefetch images failed', e);
  }
}

function Loader() {
  const { actions } = useEditor();
  useEffect(() => {
    try {
      const raw = window.__CRAFT_PAGE_STATE__;
      // eslint-disable-next-line no-console
      console.log('[Export Viewer] Estado recibido:', typeof raw, raw ? (typeof raw === 'string' ? raw.length + ' chars' : 'object') : 'null');
      if (!raw) return;
      const json = typeof raw === 'string' ? raw : JSON.stringify(raw);
      actions.deserialize(json);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('No se pudo deserializar el estado exportado', e);
      const marker = document.createElement('div');
      marker.style.cssText = 'position:fixed;inset:0;background:#fff;color:#b00020;padding:16px;font:14px system-ui;overflow:auto;';
      marker.innerText = 'Error al deserializar el estado exportado. Revisa la consola.';
      document.body.appendChild(marker);
    }
  }, [actions]);
  return null;
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('Error rendering Viewer:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16, color: '#b00020', fontFamily: 'system-ui' }}>
          <h3>Ocurrió un error al renderizar la página exportada</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function ViewerPage({ mode }) {
  const { actions } = useEditor();
  const { slug } = useParams();
  const [sp] = useSearchParams();
  const location = useLocation();
  const [animKey, setAnimKey] = useState(0);
  useEffect(() => {
    try {
      const routes = (typeof window !== 'undefined' && window.__CRAFT_ROUTES__) || null;
      if (!routes) return; // modo single-state seguirá usando Loader
      let key = null;
      if (mode === 'bySlug') {
        key = slug || '';
      } else if (mode === 'byName') {
        const name = sp.get('section') || '';
        const list = (window.__CRAFT_SECTIONS__ || []);
        const found = list.find(x => (x.name || '').toLowerCase() === name.toLowerCase());
        key = found ? found.slug : '';
      }
      if (!key) return;
      const raw = routes[key];
      if (!raw) return;
      const json = typeof raw === 'string' ? raw : JSON.stringify(raw);
      actions.deserialize(json);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('No se pudo deserializar la ruta actual', e);
    }
  }, [actions, mode, slug, sp]);
  // Reinicia animación en cada cambio de ruta
  useEffect(() => { setAnimKey((k) => k + 1); }, [location.pathname, location.search]);
  return (
    <div key={animKey} className="route-wrapper fadeIn" style={{ maxWidth: '750px', margin: '0 auto', minHeight: 400 }}>
      <Frame>
        <Element is={BackgroundImageContainer} padding={10} canvas />
      </Frame>
    </div>
  );
}

function ViewerApp() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const hasRoutes = typeof window !== 'undefined' && !!window.__CRAFT_ROUTES__;
  const startRoute = (typeof window !== 'undefined' && window.__CRAFT_START_ROUTE__) || '/';
  useEffect(() => {
    if (hasRoutes && typeof window !== 'undefined' && window.__CRAFT_ROUTES__) {
      prefetchImagesFromRoutes(window.__CRAFT_ROUTES__);
    }
  }, [hasRoutes]);
  return (
    <ErrorBoundary>
      <Editor enabled={false} resolver={resolver}>
        {!hasRoutes && <Loader />}
        {/* SPA con rutas: /, /:slug y /editor?section=NAME */}
        {hasRoutes ? (
          <Routes>
            <Route path="/" element={<Navigate to={startRoute || '/'} replace />} />
            <Route path="/editor" element={<ViewerPage mode="byName" />} />
            <Route path=":slug" element={<ViewerPage mode="bySlug" />} />
            <Route path="*" element={<div style={{padding:16}}>No encontrada</div>} />
          </Routes>
        ) : (
          <div className="route-wrapper fadeIn" style={{ maxWidth: '750px', margin: '0 auto', minHeight: 400 }}>
            {!mounted && <div style={{ padding: 16 }}>Cargando…</div>}
            <Frame>
              <Element is={BackgroundImageContainer} padding={10} canvas />
            </Frame>
          </div>
        )}
      </Editor>
    </ErrorBoundary>
  );
}

// Auto-montaje al cargar el bundle
const mount = () => {
  const el = document.getElementById('root');
  if (!el) return;
  const root = createRoot(el);
  root.render(
    <HashRouter>
      <ViewerApp />
    </HashRouter>
  );
};

mount();
