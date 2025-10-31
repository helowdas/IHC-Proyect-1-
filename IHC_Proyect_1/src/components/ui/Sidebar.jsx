import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSectionNames } from "../../hooks/useSectionNames";
import { createSection } from "../../hooks/useCreateSection";
import { deleteSection } from "../../hooks/useDeleteSection";
import { renameSection } from "../../hooks/useRenameSection";

const Sidebar = ({ items = [] }) => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const currentSection = new URLSearchParams(search).get("section");
  const { names, loading, error, refetch } = useSectionNames();
  const isEditorActive = pathname === "/editor";
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    setCreating(true);
  const initialJson = { ROOT: { type: { resolvedName: 'BackgroundImageContainer' }, isCanvas: true, props: { padding: 10, background: '#f5f5f5' }, displayName: 'BackgroundImageContainer', custom: {}, hidden: false, nodes: [], linkedNodes: {} } };
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

  const filteredNames = names.filter((name) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-64 p-1 overflow-hidden">
      <div className="d-flex justify-content-start mb-3">
        <div className="text-center">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div className="fw-semibold text-xl">Secciones</div>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={refetch}
              disabled={loading}
            >
              <i className="bi bi-arrow-clockwise"></i>
            </button>
          </div>

          {/* Form para crear una nueva sección */}
          <form className="d-flex gap-2 mb-4" onSubmit={handleCreate}>
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

          {/* Buscador de secciones */}
          <input
            type="text"
            className="form-control form-control-sm mb-3"
            placeholder="Buscar sección..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Buscar sección"
          />

          {error && (
            <div className="alert alert-danger p-2" role="alert">
              No se pudieron cargar las secciones.
            </div>
          )}

          {(!loading && names.length === 0) && (
            <div className="text-muted small">No hay secciones.</div>
          )}

          {filteredNames.map((name) => {
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

            const onRename = async () => {
              const proposed = prompt(`Nuevo nombre para "${name}"`, name);
              const newName = (proposed || '').trim();
              if (!newName || newName === name) return;
              const res = await renameSection(name, newName);
              if (!res.ok) {
                if (res.code === 'conflict') {
                  alert('Ya existe una sección con ese nombre.');
                } else if (res.code === 'not-found') {
                  alert('No se encontró la sección a renombrar.');
                } else {
                  console.error('Error renombrando sección', res.error);
                  alert('No se pudo renombrar la sección');
                }
                return;
              }
              // Refrescar lista y, si estaba activa, navegar a la nueva URL
              await refetch();
              if (isActive) {
                navigate(`/editor?section=${encodeURIComponent(newName)}`);
              }
            };

            return (
              <div key={name} className="mb-2 d-flex flex-column align-items-start justify-content-between gap-1">
                <div className="grow d-flex flex-wrap align-items-center justify-content-between gap-2">
                  <Link
                    to={`/editor?section=${encodeURIComponent(name)}`}
                    className={`btn btn-sm btn-a50104 d-inline-flex align-items-center justify-content-center${isActive ? "active" : ""}`}
                    title={name}
                    aria-label={`Ir a ${name}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <i className="bi bi-file-earmark-text fs-5" aria-hidden="true"></i>
                    <span className="ms-1">{name}</span>
                  </Link>
                  
                  <div className="d-flex align-items-stretch gap-1 ms-2">
                    <button
                  type="button"
                  className="btn btn-sm btn-outline-danger p-2"
                  onClick={onDelete}
                  aria-label={`Eliminar sección ${name}`}
                  title="Eliminar sección"
                    >
                      <i className="bi bi-trash" aria-hidden="true"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={onRename}
                      aria-label={`Renombrar sección ${name}`}
                      title="Renombrar sección"
                    >
                      <i className="bi bi-pencil" aria-hidden="true"></i>
                    </button>
                  </div>

                </div>
                <div>
                    {isActive ? (
                      <small className="text-success fw-semibold">Actual: {name}</small>
                    ) : (
                      <small className="text-muted fw-semibold">{name}</small>
                    )}
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;