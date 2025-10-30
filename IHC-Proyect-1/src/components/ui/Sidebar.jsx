import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ items = [] }) => {
  const { pathname } = useLocation();
  const isActive = (to) => pathname === to;

  return (
    <aside className="w-64 p-4 space-y-3">
      <div className="d-flex justify-content-start mb-3">
        <div className="text-center">
          {/* Botón 1 */}
          <Link
            to="/indice"
            className={`btn btn-sm btn-a50104 d-inline-flex align-items-center justify-content-center ${isActive("/indice") ? "active" : ""}`}
            title="Páginas"
            aria-label="Ir a páginas"
            aria-current={isActive("/indice") ? "page" : undefined}
          >
            <i className="bi bi-file-earmark-text fs-5" aria-hidden="true"></i>
            <span>Páginas1</span>
          </Link>
          <div>
            {isActive("/indice") ? (
              <small className="text-success">Actual: /indice</small>
            ) : (
              <small className="text-muted">/indice</small>
            )}
          </div>

          {/* Botón 2 */}
          <Link
            to="/about"
            className={`btn btn-sm btn-a50104 d-inline-flex align-items-center justify-content-center mt-2 ${isActive("/about") ? "active" : ""}`}
            title="About"
            aria-label="Ir a about"
            aria-current={isActive("/about") ? "page" : undefined}
          >
            <i className="bi bi-file-earmark-text fs-5" aria-hidden="true"></i>
            <span>Páginas2</span>
          </Link>
          <div>
            {isActive("/about") ? (
              <small className="text-success">Actual: /about</small>
            ) : (
              <small className="text-muted">/about</small>
            )}
          </div>

          {/* Botón 3 */}
          <Link
            to="/hola-mundo"
            className={`btn btn-sm btn-a50104 d-inline-flex align-items-center justify-content-center mt-2 ${isActive("/hola-mundo") ? "active" : ""}`}
            title="Hola Mundo"
            aria-label="Ir a hola mundo"
            aria-current={isActive("/hola-mundo") ? "page" : undefined}
          >
            <i className="bi bi-file-earmark-text fs-5" aria-hidden="true"></i>
            <span>Páginas3</span>
          </Link>
          <div>
            {isActive("/hola-mundo") ? (
              <small className="text-success">Actual: /hola-mundo</small>
            ) : (
              <small className="text-muted">/hola-mundo</small>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;