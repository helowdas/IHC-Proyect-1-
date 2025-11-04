import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSectionNames } from "../../hooks/useSectionNames";
import { createSection } from "../../hooks/useCreateSection";
import { deleteSection } from "../../hooks/useDeleteSection";
import { renameSection } from "../../hooks/useRenameSection";
import { pasteSection } from "../../hooks/usePasteSection";
import { hasClipboard } from "../../hooks/useCopyPasteSection";
import { getFolders, createFolder, deleteFolder, moveSectionToFolder, getSectionFolderId, getSectionsByFolder } from "../../hooks/useFolders";
import SectionMenu from "./SectionMenu";

const Sidebar = ({ items = [] }) => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const currentSection = new URLSearchParams(search).get("section");
  const { names, loading, error, refetch } = useSectionNames();
  const isEditorActive = pathname === "/editor";
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [folders, setFolders] = useState([]);
  const [sectionFolderMap, setSectionFolderMap] = useState({});
  const [expandedFolders, setExpandedFolders] = useState({});
  const [draggedSection, setDraggedSection] = useState(null);
  const [draggedOverFolder, setDraggedOverFolder] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  // Cargar carpetas y mapeo de secciones
  useEffect(() => {
    loadFolders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [names]);

  const loadFolders = async () => {
    const foldersData = await getFolders();
    setFolders(foldersData);
    
    // Cargar mapeo de secciones a carpetas
    const mapping = {};
    names.forEach((name) => {
      const folderId = getSectionFolderId(name);
      if (folderId) {
        mapping[name] = folderId;
      }
    });
    setSectionFolderMap(mapping);
  };

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

  const handleCreateFolder = async () => {
    const folderName = prompt('Nombre de la carpeta:');
    if (!folderName || !folderName.trim()) return;

    const result = await createFolder(folderName.trim());
    if (result.ok) {
      await loadFolders();
    } else {
      alert('Error creando la carpeta');
    }
  };

  const handlePaste = async (newSectionName) => {
    const result = await pasteSection(newSectionName);
    if (result.ok) {
      await refetch();
    } else if (result.code === 'exists') {
      alert('Ya existe una sección con ese nombre.');
    } else {
      alert('Error pegando la sección');
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (!confirm('¿Eliminar esta carpeta? Las secciones dentro se moverán a la raíz.')) return;
    
    const result = await deleteFolder(folderId);
    if (result.ok) {
      await loadFolders();
      await refetch();
    } else {
      alert('Error eliminando la carpeta');
    }
  };

  const toggleFolder = (folderId) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  // Drag and Drop handlers
  const handleDragStart = (e, sectionName) => {
    setDraggedSection(sectionName);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, folderId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDraggedOverFolder(folderId);
  };

  const handleDragLeave = () => {
    setDraggedOverFolder(null);
  };

  const handleDrop = async (e, folderId) => {
    e.preventDefault();
    if (draggedSection) {
      const result = await moveSectionToFolder(draggedSection, folderId);
      if (result.ok) {
        await loadFolders();
      } else {
        alert('Error moviendo la sección');
      }
    }
    setDraggedSection(null);
    setDraggedOverFolder(null);
  };

  const handleDropRoot = async (e) => {
    e.preventDefault();
    if (draggedSection) {
      const result = await moveSectionToFolder(draggedSection, null);
      if (result.ok) {
        await loadFolders();
      } else {
        alert('Error moviendo la sección');
      }
    }
    setDraggedSection(null);
    setDraggedOverFolder(null);
  };

  // Manejar menú contextual (clic derecho)
  const handleContextMenu = (e, folderId = null) => {
    e.preventDefault();
    if (!hasClipboard()) return;
    
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      folderId,
    });
  };

  const handleContextMenuPaste = async () => {
    if (!contextMenu) return;
    
    const newName = prompt('Nombre para la nueva sección:');
    if (!newName || !newName.trim()) {
      setContextMenu(null);
      return;
    }

    const result = await handlePaste(newName.trim());
    if (result && result.ok && contextMenu.folderId) {
      // Si se pegó en una carpeta, mover la sección a esa carpeta
      await moveSectionToFolder(newName.trim(), contextMenu.folderId);
      await loadFolders();
    } else if (result && result.ok) {
      await refetch();
      await loadFolders();
    }
    
    setContextMenu(null);
  };

  // Cerrar menú contextual al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(null);
    };

    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [contextMenu]);

  const filteredNames = names.filter((name) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Organizar secciones por carpeta
  const sectionsByFolder = {};
  const rootSections = [];

  filteredNames.forEach((name) => {
    const folderId = sectionFolderMap[name];
    if (folderId) {
      if (!sectionsByFolder[folderId]) {
        sectionsByFolder[folderId] = [];
      }
      sectionsByFolder[folderId].push(name);
    } else {
      rootSections.push(name);
    }
  });

  return (
    <aside className="w-64 p-1" style={{ overflowX: 'visible', minWidth: '256px' }}>
      <div className="d-flex justify-content-start mb-3">
        <div className="text-center w-100" style={{ overflowX: 'visible' }}>
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
          <form className="d-flex gap-2 mb-2" onSubmit={handleCreate}>
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

          {/* Botón para crear carpeta */}
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary w-100 mb-2"
            onClick={handleCreateFolder}
          >
            <i className="bi bi-folder-plus me-1"></i> Nueva Carpeta
          </button>

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

          {/* Área de raíz para soltar secciones */}
          <div
            onDragOver={(e) => { e.preventDefault(); }}
            onDrop={handleDropRoot}
            onContextMenu={(e) => handleContextMenu(e, null)}
            style={{
              minHeight: '40px',
              padding: '8px',
              border: draggedOverFolder === null && draggedSection ? '2px dashed #0d6efd' : 'none',
              borderRadius: '4px',
              marginBottom: '8px',
            }}
          >
            {folders.length > 0 && (
              <small className="text-muted d-block mb-2">Raíz</small>
            )}

            {/* Secciones en la raíz */}
            {rootSections.map((name) => (
              <SectionItem
                key={name}
                name={name}
                isActive={isEditorActive && currentSection === name}
                onDelete={async () => {
                  if (!confirm(`¿Eliminar la sección "${name}"? Esta acción no se puede deshacer.`)) return;
                  const result = await deleteSection(name);
                  if (!result.ok) {
                    console.error('No se pudo eliminar la sección', result.error);
                    alert('Error eliminando la sección');
                  }
                  await refetch();
                  await loadFolders();
                }}
                onRename={async () => {
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
                  await refetch();
                  await loadFolders();
                  if (isEditorActive && currentSection === name) {
                    navigate(`/editor?section=${encodeURIComponent(newName)}`);
                  }
                }}
                onPaste={handlePaste}
                onDragStart={handleDragStart}
                navigate={navigate}
              />
            ))}
          </div>

          {/* Carpetas */}
          {folders.map((folder) => (
            <FolderItem
              key={folder.id}
              folder={folder}
              sections={sectionsByFolder[folder.id] || []}
              isExpanded={expandedFolders[folder.id]}
              onToggle={() => toggleFolder(folder.id)}
              onDelete={() => handleDeleteFolder(folder.id)}
              onDragOver={(e) => handleDragOver(e, folder.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, folder.id)}
              draggedOver={draggedOverFolder === folder.id}
              currentSection={currentSection}
              isEditorActive={isEditorActive}
              onSectionAction={async (action, sectionName) => {
                if (action === 'delete') {
                  if (!confirm(`¿Eliminar la sección "${sectionName}"? Esta acción no se puede deshacer.`)) return;
                  const result = await deleteSection(sectionName);
                  if (!result.ok) {
                    alert('Error eliminando la sección');
                  }
                  await refetch();
                  await loadFolders();
                } else if (action === 'rename') {
                  const proposed = prompt(`Nuevo nombre para "${sectionName}"`, sectionName);
                  const newName = (proposed || '').trim();
                  if (!newName || newName === sectionName) return;
                  const res = await renameSection(sectionName, newName);
                  if (!res.ok) {
                    if (res.code === 'conflict') {
                      alert('Ya existe una sección con ese nombre.');
                    } else {
                      alert('No se pudo renombrar la sección');
                    }
                    return;
                  }
                  await refetch();
                  await loadFolders();
                  if (isEditorActive && currentSection === sectionName) {
                    navigate(`/editor?section=${encodeURIComponent(newName)}`);
                  }
                }
              }}
              onDragStartSection={handleDragStart}
              navigate={navigate}
              onContextMenu={handleContextMenu}
            />
          ))}

          {/* Menú contextual */}
          {contextMenu && (
            <div
              className="dropdown-menu show position-fixed"
              style={{
                left: `${contextMenu.x}px`,
                top: `${contextMenu.y}px`,
                zIndex: 1000,
                minWidth: '200px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {hasClipboard() && (
                <button
                  className="dropdown-item"
                  onClick={handleContextMenuPaste}
                  type="button"
                >
                  <i className="bi bi-clipboard me-2"></i> Pegar Sección
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

// Componente para renderizar una sección
function SectionItem({ name, isActive, onDelete, onRename, onPaste, onDragStart, navigate }) {
  const handleDragStartLocal = (e) => {
    if (onDragStart) {
      onDragStart(e, name);
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStartLocal}
      className="mb-2 d-flex flex-column align-items-start justify-content-between gap-1"
      style={{ width: '100%', overflowX: 'visible' }}
    >
      <div className="grow d-flex align-items-center gap-2 w-100" style={{ minWidth: 0 }}>
        <Link
          to={`/editor?section=${encodeURIComponent(name)}`}
          className={`btn btn-sm btn-a50104 d-inline-flex align-items-center${isActive ? " active" : ""}`}
          style={{ minWidth: 0, overflow: 'hidden', flex: '1 1 auto', maxWidth: 'calc(100% - 40px)' }}
          title={name}
          aria-label={`Ir a ${name}`}
          aria-current={isActive ? "page" : undefined}
        >
          <i className="bi bi-file-earmark-text fs-5 flex-shrink-0" aria-hidden="true"></i>
          <span className="ms-1 text-truncate">{name}</span>
        </Link>
        
        <div style={{ flexShrink: 0 }}>
          <SectionMenu
            sectionName={name}
            onDelete={onDelete}
            onRename={onRename}
            onPaste={onPaste}
          />
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
}

// Componente para renderizar una carpeta
function FolderItem({
  folder,
  sections,
  isExpanded,
  onToggle,
  onDelete,
  onDragOver,
  onDragLeave,
  onDrop,
  draggedOver,
  currentSection,
  isEditorActive,
  onSectionAction,
  navigate,
  onDragStartSection,
  onContextMenu,
}) {

  return (
    <div className="mb-2">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onContextMenu={(e) => {
          e.stopPropagation();
          if (onContextMenu) {
            onContextMenu(e, folder.id);
          }
        }}
        style={{
          border: draggedOver ? '2px dashed #0d6efd' : '1px solid #dee2e6',
          borderRadius: '4px',
          padding: '8px',
          backgroundColor: draggedOver ? '#f0f7ff' : 'transparent',
        }}
      >
        <div className="d-flex align-items-center justify-content-between mb-2">
          <button
            type="button"
            className="btn btn-sm btn-link p-0 text-start text-decoration-none d-flex align-items-center"
            onClick={onToggle}
            style={{ flex: 1 }}
          >
            <i className={`bi bi-chevron-${isExpanded ? 'down' : 'right'} me-1`}></i>
            <i className="bi bi-folder me-1"></i>
            <span className="fw-semibold">{folder.nombre}</span>
            <span className="text-muted ms-2 small">({sections.length})</span>
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger p-1"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            aria-label={`Eliminar carpeta ${folder.nombre}`}
            title="Eliminar carpeta"
          >
            <i className="bi bi-trash" aria-hidden="true"></i>
          </button>
        </div>

        {isExpanded && (
          <div className="ms-3">
            {sections.length === 0 ? (
              <div className="text-muted small">Vacía</div>
            ) : (
              sections.map((sectionName) => (
                <SectionItem
                  key={sectionName}
                  name={sectionName}
                  isActive={isEditorActive && currentSection === sectionName}
                  onDelete={() => onSectionAction('delete', sectionName)}
                  onRename={() => onSectionAction('rename', sectionName)}
                  onPaste={async (newName) => {
                    // Esto se maneja en el SectionMenu
                  }}
                  onDragStart={onDragStartSection}
                  navigate={navigate}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
