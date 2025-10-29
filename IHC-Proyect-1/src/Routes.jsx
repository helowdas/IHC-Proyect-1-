import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import App from './App.jsx';

// Router con transiciones CSS y sin navbar. Renderiza tu editor (App.jsx) en /editor.
export default function RootRoutes() {
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
          <Route path="/home" element={<Home />} />
          <Route path="/editor" element={<App />} />
        </Routes>
      </div>
    </div>
  );
}
