import { supabase } from '../../SupabaseCredentials';

/**
 * Obtiene todas las carpetas desde la tabla Carpetas
 * Si la tabla no existe, retorna un array vacío
 */
export async function getFolders() {
  try {
    // Intentar obtener carpetas desde una tabla 'Carpetas'
    // Si no existe, usaremos localStorage como fallback
    const { data, error } = await supabase
      .from('Carpetas')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) {
      // Si la tabla no existe, usar localStorage
      return getFoldersFromLocalStorage();
    }

    return data || [];
  } catch (error) {
    console.warn('Error obteniendo carpetas desde BD, usando localStorage:', error);
    return getFoldersFromLocalStorage();
  }
}

/**
 * Crea una nueva carpeta
 */
export async function createFolder(folderName) {
  const name = (folderName || '').trim();
  if (!name) {
    return { ok: false, error: new Error('El nombre de la carpeta es requerido') };
  }

  try {
    // Intentar crear en BD
    const { data, error } = await supabase
      .from('Carpetas')
      .insert({ nombre: name })
      .select()
      .single();

    if (error) {
      // Si la tabla no existe, usar localStorage
      return createFolderInLocalStorage(name);
    }

    return { ok: true, folder: data };
  } catch (error) {
    console.warn('Error creando carpeta en BD, usando localStorage:', error);
    return createFolderInLocalStorage(name);
  }
}

/**
 * Elimina una carpeta
 */
export async function deleteFolder(folderId, siteId = null) {
  try {
    // Intentar eliminar desde BD
    const { error } = await supabase
      .from('Carpetas')
      .delete()
      .eq('id', folderId);

    if (error) {
      // Si la tabla no existe, usar localStorage
      return deleteFolderFromLocalStorage(folderId);
    }

    // Mover secciones de la carpeta eliminada a la raíz
    let q = supabase
      .from('Secciones')
      .update({ folderId: null })
      .eq('folderId', folderId);
    if (siteId) q = q.eq('site_id', siteId);
    await q;

    return { ok: true };
  } catch (error) {
    console.warn('Error eliminando carpeta desde BD, usando localStorage:', error);
    return deleteFolderFromLocalStorage(folderId);
  }
}

/**
 * Mueve una sección a una carpeta
 */
export async function moveSectionToFolder(sectionName, folderId, siteId = null) {
  try {
    let q = supabase
      .from('Secciones')
      .update({ folderId: folderId || null })
      .eq('nameSeccion', sectionName);
    if (siteId) q = q.eq('site_id', siteId);
    const { error } = await q;

    if (error) {
      // Si falla, usar localStorage
      return moveSectionToFolderLocalStorage(sectionName, folderId);
    }

    return { ok: true };
  } catch (error) {
    console.warn('Error moviendo sección a carpeta en BD, usando localStorage:', error);
    return moveSectionToFolderLocalStorage(sectionName, folderId);
  }
}

// Funciones de localStorage como fallback
const FOLDERS_KEY = 'section_folders';
const SECTION_FOLDERS_KEY = 'section_folder_mapping';

function getFoldersFromLocalStorage() {
  try {
    const data = localStorage.getItem(FOLDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
}

function createFolderInLocalStorage(folderName) {
  try {
    const folders = getFoldersFromLocalStorage();
    const newFolder = {
      id: Date.now().toString(),
      nombre: folderName,
      createdAt: new Date().toISOString(),
    };
    folders.push(newFolder);
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
    return { ok: true, folder: newFolder };
  } catch (error) {
    return { ok: false, error };
  }
}

function deleteFolderFromLocalStorage(folderId) {
  try {
    const folders = getFoldersFromLocalStorage();
    const updated = folders.filter((f) => f.id !== folderId);
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(updated));

    // Mover secciones de la carpeta eliminada a la raíz
    const mapping = getSectionFolderMapping();
    Object.keys(mapping).forEach((sectionName) => {
      if (mapping[sectionName] === folderId) {
        delete mapping[sectionName];
      }
    });
    localStorage.setItem(SECTION_FOLDERS_KEY, JSON.stringify(mapping));

    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}

function moveSectionToFolderLocalStorage(sectionName, folderId) {
  try {
    const mapping = getSectionFolderMapping();
    if (folderId) {
      mapping[sectionName] = folderId;
    } else {
      delete mapping[sectionName];
    }
    localStorage.setItem(SECTION_FOLDERS_KEY, JSON.stringify(mapping));
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}

function getSectionFolderMapping() {
  try {
    const data = localStorage.getItem(SECTION_FOLDERS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    return {};
  }
}

/**
 * Obtiene el folderId de una sección
 */
export function getSectionFolderId(sectionName) {
  try {
    const mapping = getSectionFolderMapping();
    return mapping[sectionName] || null;
  } catch (error) {
    return null;
  }
}

/**
 * Obtiene todas las secciones agrupadas por carpeta
 */
export async function getSectionsByFolder(sections) {
  const mapping = getSectionFolderMapping();
  const folders = await getFolders();
  const folderMap = {};
  const rootSections = [];

  folders.forEach((folder) => {
    folderMap[folder.id] = {
      ...folder,
      sections: [],
    };
  });

  sections.forEach((sectionName) => {
    const folderId = mapping[sectionName];
    if (folderId && folderMap[folderId]) {
      folderMap[folderId].sections.push(sectionName);
    } else {
      rootSections.push(sectionName);
    }
  });

  return {
    folders: Object.values(folderMap),
    rootSections,
  };
}

