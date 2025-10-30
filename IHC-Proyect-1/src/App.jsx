import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Editor from './pages/Editor.jsx';

// Vista simple para placeholders
function Page({ title, children }) {
  return (
    <div className="container py-3">
      <h2 className="mb-2">{title}</h2>
      <p className="mb-0">{children}</p>
    </div>
  );
}

// Router con transiciones CSS y sin navbar. Renderiza tu editor (App.jsx) en /editor.
export default function App() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [stage, setStage] = useState('fadeIn'); // fadeIn | fadeOut

  useEffect(() => {
    if (location !== displayLocation) setStage('fadeOut');
  }, [location, displayLocation]);

  const handleAnimationEnd = () => {
    if (stage === 'fadeOut') {
      setStage('fadeIn');
      setDisplayLocation(location);
    }
  };

  return (
    <div className="min-h-screen">
      <div className={`p-4 route-wrapper ${stage}`} onAnimationEnd={handleAnimationEnd}>
        <Routes location={displayLocation}>
          {/* Redirige la ruta raíz al editor para que se muestre primero */}
          <Route path="/" element={<Navigate to="/editor" replace />} />

          {/* Rutas principales */}
          <Route path="/home" element={<Home />} />
          <Route path="/editor" element={<Editor />} />

          {/* Rutas del Sidebar usando renderizado condicional por ruta */}
          <Route path="/indice" element={<Page title="Índice">Página índice.</Page>} />
          <Route path="/about" element={<Page title="About">Acerca de esta app.</Page>} />
          <Route path="/hola-mundo" element={<Page title="Hola Mundo">Ejemplo básico.</Page>} />

          {/* 404 opcional */}
          <Route path="*" element={<Page title="No encontrado">La ruta no existe.</Page>} />
        </Routes>
      </div>
    </div>
  );
}