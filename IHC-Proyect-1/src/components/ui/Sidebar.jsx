import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSectionNames } from "../../hooks/useSectionNames";
import { createSection } from "../../hooks/useCreateSection";
import { deleteSection } from "../../hooks/useDeleteSection";

const Sidebar = ({ items = [] }) => {
  const { pathname, search } = useLocation();
  const currentSection = new URLSearchParams(search).get("section");
  const { names, loading, error, refetch } = useSectionNames();
  const isEditorActive = pathname === "/editor";
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    setCreating(true);
    const initialJson = { ROOT: { type: { resolvedName: 'Container' }, isCanvas: true, props: { padding: 5, background: '#f5f5f5' }, displayName: 'Container', custom: {}, hidden: false, nodes: [], linkedNodes: {} } };
    const result = await createSection(name, initialJson);
    if (result.ok) {
      setNewName("");
      await refetch();
    } else if (result.code === 'exists') {
      alert('La sección ya existe.');
    } else {
      console.error('No se pudo crear la sección', result.error);
      alert('Error creando la sección');
    }
    setCreating(false);
  };

  return (
    <aside className="w-64 p-4 space-y-3">
      <div className="d-flex justify-content-start mb-3">
        <div className="text-center">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="fw-semibold">Secciones</div>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={refetch}
              disabled={loading}
            >
              <i class="bi bi-arrow-clockwise"></i>
            </button>
          </div>

          {/* Form para crear una nueva sección */}
          <form className="d-flex gap-2 mb-3" onSubmit={handleCreate}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Nueva sección"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              disabled={creating}
              aria-label="Nombre de nueva sección"
            />
            <button type="submit" className="btn btn-sm btn-primary" disabled={creating || !newName.trim()}>
              {creating ? 'Creando…' : 'Crear'}
            </button>
          </form>

          {error && (
            <div className="alert alert-danger p-2" role="alert">
              No se pudieron cargar las secciones.
            </div>
          )}

          {(!loading && names.length === 0) && (
            <div className="text-muted small">No hay secciones.</div>
          )}

          {names.map((name) => {
            const isActive = isEditorActive && currentSection === name;
            const onDelete = async () => {
              if (!confirm(`¿Eliminar la sección "${name}"? Esta acción no se puede deshacer.`)) return;
              const result = await deleteSection(name);
              if (!result.ok) {
                console.error('No se pudo eliminar la sección', result.error);
                alert('Error eliminando la sección');
              }
              await refetch();
            };

            return (
              <div key={name} className="mb-2 d-flex align-items-center justify-content-between gap-2">
                <div className="flex-grow-1">
                  <Link
                    to={`/editor?section=${encodeURIComponent(name)}`}
                    className={`btn btn-sm btn-a50104 d-inline-flex align-items-center justify-content-center w-100 ${isActive ? "active" : ""}`}
                    title={name}
                    aria-label={`Ir a ${name}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <i className="bi bi-file-earmark-text fs-5" aria-hidden="true"></i>
                    <span className="ms-1">{name}</span>
                  </Link>
                  <div>
                    {isActive ? (
                      <small className="text-success">Actual: {name}</small>
                    ) : (
                      <small className="text-muted">{name}</small>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={onDelete}
                  aria-label={`Eliminar sección ${name}`}
                  title="Eliminar sección"
                >
                  <i className="bi bi-trash" aria-hidden="true"></i>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;