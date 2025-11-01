import React, { useState, useRef, useEffect } from 'react';
import { copySection, cutSection, hasClipboard } from '../../hooks/useCopyPasteSection';
import { useGetSectionData } from '../../hooks/useGetSectionData';

export default function SectionMenu({ sectionName, onDelete, onRename, onPaste, onCopy, onCut }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleCopy = async () => {
    try {
      const sectionData = await useGetSectionData(sectionName);
      console.log('Datos copiados de la sección:', sectionName, sectionData);
      if (sectionData) {
        // Verificar que los datos tengan contenido
        const hasContent = sectionData && typeof sectionData === 'object' && Object.keys(sectionData).length > 0;
        if (!hasContent) {
          console.warn('La sección parece estar vacía:', sectionData);
        }
        copySection(sectionName, sectionData);
        setShowMenu(false);
        if (onCopy) onCopy(sectionName);
      } else {
        alert('No se pudieron obtener los datos de la sección para copiar.');
      }
    } catch (error) {
      console.error('Error copiando sección:', error);
      alert('Error al copiar la sección: ' + error.message);
    }
  };

  const handleCut = async () => {
    try {
      const sectionData = await useGetSectionData(sectionName);
      console.log('Datos cortados de la sección:', sectionName, sectionData);
      if (sectionData) {
        // Verificar que los datos tengan contenido
        const hasContent = sectionData && typeof sectionData === 'object' && Object.keys(sectionData).length > 0;
        if (!hasContent) {
          console.warn('La sección parece estar vacía:', sectionData);
        }
        cutSection(sectionName, sectionData);
        setShowMenu(false);
        if (onCut) onCut(sectionName);
      } else {
        alert('No se pudieron obtener los datos de la sección para cortar.');
      }
    } catch (error) {
      console.error('Error cortando sección:', error);
      alert('Error al cortar la sección: ' + error.message);
    }
  };

  const handlePaste = async () => {
    const newName = prompt('Nombre para la nueva sección:');
    if (!newName || !newName.trim()) return;
    
    setShowMenu(false);
    if (onPaste) {
      await onPaste(newName.trim());
    }
  };

  return (
    <div className="position-relative" ref={menuRef}>
      <button
        type="button"
        className="btn btn-sm btn-outline-secondary p-1"
        onClick={() => setShowMenu(!showMenu)}
        aria-label="Opciones de sección"
        title="Opciones"
      >
        <i className="bi bi-three-dots-vertical"></i>
      </button>

      {showMenu && (
        <div 
          className="dropdown-menu show position-absolute end-0"
          style={{ top: '100%', zIndex: 1000, minWidth: '150px' }}
        >
          <button
            className="dropdown-item"
            onClick={handleCopy}
            type="button"
          >
            <i className="bi bi-files me-2"></i> Copiar
          </button>
          <button
            className="dropdown-item"
            onClick={handleCut}
            type="button"
          >
            <i className="bi bi-scissors me-2"></i> Cortar
          </button>
          {hasClipboard() && (
            <button
              className="dropdown-item"
              onClick={handlePaste}
              type="button"
            >
              <i className="bi bi-clipboard me-2"></i> Pegar
            </button>
          )}
          <hr className="dropdown-divider" />
          <button
            className="dropdown-item"
            onClick={onRename}
            type="button"
          >
            <i className="bi bi-pencil me-2"></i> Renombrar
          </button>
          <button
            className="dropdown-item text-danger"
            onClick={onDelete}
            type="button"
          >
            <i className="bi bi-trash me-2"></i> Eliminar
          </button>
        </div>
      )}
    </div>
  );
}

